import { createSignal, createEffect, type Accessor, type Setter, createContext, useContext, createResource, type ResourceReturn, createMemo } from "solid-js";
import type { QuoteList, QuoteListId } from "../../storage/schema";
import { expect, originsForSite } from "../../lib/util";
import type { SiteId, SiteList } from "../../types/sitelist";
import { loadEnabledSites, loadHideQuotes, loadQuoteList, loadQuoteLists, loadSettingsLocked, loadSnoozeMode, saveHideQuotes, saveNewQuoteList, saveSettingsLocked } from "../../storage/storage";
import type { Quote } from "../../quote";
import { sendToServiceWorker } from "../../messaging/messages";
import { getBrowser, type Permissions } from "../../lib/webextension";
import { createStore, reconcile } from "solid-js/store";

type SignalObj<T> = {
	set: Setter<T>,
	get: Accessor<T>,
};

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

/**
 * Destructuring is inconvenient inside objects, so this is to make it more explicit what's going on
 */
export const signalObj = <T>(defaultVal: T): SignalObj<T> => {
	const [get, set] = createSignal(defaultVal);
	return {set, get}
};

export const resourceObj = <T, R>(v: ResourceReturn<T, R>) => {
	const [get, { refetch }] = v;
	return {get, refetch};
};

export const resourceObjReconciled = <T>(fn: () => Promise<T[]>) => {
	const [getInternal, setInternal] = createStore <{ items: T[] | null }>({ items: null });

	const get = () => getInternal.items;

	const refetch = async () => {
		const newStore: { items: T[] } = { items: await fn() };
		setInternal(reconcile(newStore, { key: 'id', merge: true }));
	};

	refetch();

	return {get, refetch};
};

export type PageId = 'sites' | 'snooze' | 'quotes' | 'about';

const browser = getBrowser();


export class OptionsPageState {
	selectedSiteId = signalObj<SiteId | null>(null);
	selectedQuoteListId = signalObj<QuoteListId | null>(null);
	editing = signalObj<EditingState | null>(null);
	page = signalObj<PageId>('sites');
	undo = signalObj<UndoState | null>(null);
	clock = signalObj<number>(Date.now());

	settingsLocked = resourceObj(createResource(loadSettingsLocked));
	snoozeState = resourceObj(createResource<number | null>(async () => browser.runtime.sendMessage({ type: 'readSnooze' })));
	snoozeMode = resourceObj(createResource(loadSnoozeMode));
	enabledSites = resourceObj(createResource(loadEnabledSites));
	hideQuotes = resourceObj(createResource(loadHideQuotes));
	permissions = resourceObj(createResource(() => browser.permissions.getAll()));
	enabledScripts = resourceObj(createResource(async () => {
		const scripts = await browser.scripting.getRegisteredContentScripts();
		return scripts.map(script => script.id) as SiteId[];
	}));

	siteList = resourceObj(createResource<SiteList | undefined>(async () => {
			const siteListUrl = browser.runtime.getURL('sitelist.json');
			return await fetch(siteListUrl).then(siteList => siteList.json());
	}));

	quoteLists = resourceObjReconciled(loadQuoteLists);

	constructor() {
		// Clock is only used for animating and updating displayed times
		const updateClock = () => {
			this.clock.set(Date.now());
			requestAnimationFrame(updateClock);
		};
		requestAnimationFrame(updateClock);
	}

	selectedQuoteList = () => {
		const qlId = this.selectedQuoteListId.get();
		if (qlId == null) return null;

		const lists = this.quoteLists.get()
		if (lists == null) return null;

		return lists.find(ql => ql.id === qlId);
	};

	withEditingType<T extends NonNullable<EditingState>['type']>(type: T) {
		const editingState = this.editing.get();
		if (editingState == null) return null;
		if (editingState.type !== type) return null;
		return editingState as Extract<NonNullable<EditingState>, { type: T }>;
	}

	async setHideQuotes(hideQuotes: boolean) {
		await saveHideQuotes(hideQuotes);
		this.hideQuotes.refetch();
		sendToServiceWorker({
			type: 'notifyOptionsUpdated',
		})
	}

	async newQuoteList() {
		const id = await saveNewQuoteList({ title: 'New List', quotes: [], imported: false, disabledQuoteIds: [] });
		await this.quoteLists.refetch();
		this.selectedQuoteListId.set(id);
	}

	async requestPermissions(permissions: Permissions): Promise<boolean> {
		const result = await browser.permissions.request(permissions);
		this.permissions.refetch();
		return result;
	}

	async removePermissions(permissions: Permissions) {
		await browser.permissions.remove(permissions);
		this.permissions.refetch();
	}

	siteState(siteId: SiteId): SiteState {
		const enabled = this.enabledSites.get()?.includes(siteId) ?? false;
		const scriptRegistered = this.enabledScripts.get()?.includes(siteId) ?? false;
		const site = this.siteList.get()?.sites.find(site => site.id === siteId);

		let permissionsEnabled = true;
		if (site != null) {
			const origins = originsForSite(site);
			for (const origin of origins) {
				if (!this.permissions.get()?.origins.includes(origin)) {
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
		const enabledSites = this.enabledSites.get() ?? [];

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
			const site = this.siteList.get()?.sites.find(site => site.id === siteId);
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

		this.snoozeState.refetch();
	}

	async cancelSnooze() {
		await browser.runtime.sendMessage({
			type: 'snooze',
			until: this.clock.get(),
		})
		this.snoozeState.refetch();
	}

	snoozeRemaining() {
		const snooze = this.snoozeState.get();
		if (snooze == null) return 0;
		return Math.max(0, snooze - this.clock.get());
	}

	async setSettingsLocked(locked: boolean) {
		if (locked) {
			this.selectedSiteId.set(null);
		}
		await saveSettingsLocked(locked);
		await this.settingsLocked.refetch();
	}

	/**
 * Returns true if the user is not currently allowed to change settings (eg not currently snoozing)
 */
	settingsLockedDown() {
		return this.settingsLocked.get() ?? false;
	}

	canUnlockSettings() {
		return this.snoozeRemaining() > 0;
	}
}

export const OptionsPageStateContext = createContext<OptionsPageState>();
export const useOptionsPageState = () => expect(useContext(OptionsPageStateContext));
