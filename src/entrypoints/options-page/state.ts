import { createSignal, createEffect, createContext, useContext, createMemo, refresh } from "solid-js";
import type { QuoteList, QuoteListId } from "../../storage/schema";
import { expect, originsForSite } from "../../lib/util";
import type { SiteId, SiteList } from "../../types/sitelist";
import { loadEnabledSites, loadQuoteLists, loadSitelist, loadSnoozeMode } from "../../storage/storage";
import type { Quote } from "../../quote";
import { getBrowser, type Permissions } from "../../lib/webextension";
import { resourceObjReconciled, signalObj, type SignalObj } from "/lib/solid-util";
import { StorageState } from "./state/storage";
import { sendToServiceWorker } from "/messaging/messages";
import { createMediaQuery } from "@solid-primitives/media";

export type EditingState = {
	type: 'existingQuote'
	existingQuoteId: string
} | {
	type: 'newQuote'
} | {
	type: 'quoteListTitle',
	editValue: SignalObj<string>,
	quoteListId: QuoteListId,
};

export type UndoState = {
	type: 'deleteQuote',
	quoteListId: QuoteListId,
	quote: Quote,
} | {
	type: 'deleteQuoteList',
	quoteList: QuoteList,
};

type SiteState = {
	enabled: boolean,
	scriptRegistered: boolean,
	permissionsEnabled: boolean,
};

export type PageId = 'sites' | 'snooze' | 'quotes' | 'style' | 'about' | 'debug';

const browser = getBrowser();

export class OptionsPageState {
	selectedSiteId = signalObj<SiteId | null>(null);
	selectedQuoteListId = signalObj<QuoteListId | null>(null);
	editing = signalObj<EditingState | null>(null);
	page = signalObj<PageId>('sites');
	undo = signalObj<UndoState | null>(null);
	clock = signalObj<number>(Date.now());

	storage = new StorageState();

	snoozeState = createMemo(async () => browser.runtime.sendMessage({ type: 'readSnooze' }));
	snoozeMode = createMemo(loadSnoozeMode);
	enabledSites = createMemo(loadEnabledSites);
	permissions = createMemo(() => browser.permissions.getAll());
	enabledScripts = createMemo(async () => {
		const scripts = await browser.scripting.getRegisteredContentScripts();
		return scripts.map(script => script.id) as SiteId[];
	});

	siteList = createMemo<SiteList | undefined>(async () => {
		return loadSitelist();
	});

	quoteLists = resourceObjReconciled(loadQuoteLists);

	isSmallScreen = createMediaQuery('(max-width: 600px)');

	constructor() {
		// Clock is only used for animating and updating displayed times
		const updateClock = () => {
			this.clock.set(Date.now());
			requestAnimationFrame(updateClock);
		};
		requestAnimationFrame(updateClock);
	}

	async reloadSiteList() {
		sendToServiceWorker({ type: 'reloadSiteList' });
		await loadSitelist(true);
		refresh(this.siteList);
	}

	selectedQuoteList = createMemo(() => {
		const qlId = this.selectedQuoteListId.get();
		if (qlId == null) return null;

		const lists = this.quoteLists.get()
		if (lists == null) return null;

		return lists.find(ql => ql.id === qlId);
	});

	withEditingType<T extends NonNullable<EditingState>['type']>(type: T) {
		const editingState = this.editing.get();
		if (editingState == null) return null;
		if (editingState.type !== type) return null;
		return editingState as Extract<NonNullable<EditingState>, { type: T }>;
	}

	async newQuoteList() {
		const id = await this.storage.newQuoteList();
		await this.quoteLists.refetch();
		this.selectedQuoteListId.set(id);
	}

	async requestPermissions(permissions: Permissions): Promise<boolean> {
		const result = await browser.permissions.request(permissions);
		refresh(this.permissions);
		return result;
	}

	async removePermissions(permissions: Permissions) {
		await browser.permissions.remove(permissions);
		refresh(this.permissions);
	}

	siteState(siteId: SiteId): SiteState {
		const enabled = this.enabledSites().includes(siteId) ?? false;
		const scriptRegistered = this.enabledScripts().includes(siteId) ?? false;
		const site = this.siteList()?.sites.find(site => site.id === siteId);

		let permissionsEnabled = true;
		if (site != null) {
			const origins = originsForSite(site);
			for (const origin of origins) {
				if (!this.permissions().origins.includes(origin)) {
					permissionsEnabled = false;
					break;
				}
			}
		}

		return {
			enabled,
			scriptRegistered,
			permissionsEnabled,
		}
	}

	sitesWithInvalidPermissions = createMemo(() => {
		let invalidSites: SiteId[] = [];
		const enabledSites = this.enabledSites() ?? [];

		for (const siteId of enabledSites) {
			const siteState = this.siteState(siteId);
			if (!siteState.permissionsEnabled) {
				invalidSites.push(siteId);
			}
		}

		return invalidSites;
	});

	allSitePermissionsValid() {
		return this.sitesWithInvalidPermissions().length === 0;
	}

	fixPermissions() {
		const invalidSites = this.sitesWithInvalidPermissions();

		let origins: string[] = [];

		for (const siteId of invalidSites) {
			const site = this.siteList()?.sites.find(site => site.id === siteId);
			if (site == null) continue;
			origins.push(...originsForSite(site));
		}

		this.requestPermissions({ origins, permissions: [] });
	}

	async startSnooze(durationMs: number) {
		await browser.runtime.sendMessage({
			type: 'snooze',
			until: this.clock.get() + durationMs,
		})

		refresh(this.snoozeState);
	}

	async cancelSnooze() {
		await browser.runtime.sendMessage({
			type: 'snooze',
			until: this.clock.get(),
		})
		refresh(this.snoozeState);
	}

	snoozeRemaining() {
		const snooze = this.snoozeState();
		if (snooze == null) return 0;
		return Math.max(0, snooze - this.clock.get());
	}

	async setSettingsLocked(locked: boolean) {
		if (locked) {
			this.selectedSiteId.set(null);
		}
		await this.storage.setSettingsLocked(locked);
	}

	/**
 * Returns true if the user is not currently allowed to change settings (eg not currently snoozing)
 */
	settingsLockedDown() {
		return this.storage.settingsLocked() ?? false;
	}

	canUnlockSettings() {
		return this.snoozeRemaining() > 0;
	}
}

export const OptionsPageStateContext = createContext<OptionsPageState>();
export const useOptionsPageState = () => expect(useContext(OptionsPageStateContext));
