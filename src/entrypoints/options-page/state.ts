import { createSignal, createEffect, type Accessor, type Setter, type Signal, createContext, useContext, createResource, type ResourceReturn, createMemo } from "solid-js";
import type { QuoteList, QuoteListId } from "../../storage/schema";
import { assertDefined, originsForSite } from "../../lib/util";
import type { SiteId, SiteList } from "../../types/sitelist";
import { loadEnabledSites, loadHideQuotes, loadQuoteList, loadQuoteLists, saveHideQuotes } from "../../storage/storage";
import type { Quote } from "../../quote";
import { sendToServiceWorker } from "../../messaging/messages";
import { getBrowser, type Permissions } from "../../lib/webextension";

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

export type PageId = 'sites' | 'quotes' | 'about';

const browser = getBrowser();

export class OptionsPageState {
	selectedSiteId = signalObj<SiteId | null>(null);
	selectedQuoteListId = signalObj<QuoteListId | null>(null);
	editing = signalObj<EditingState | null>(null);
	page = signalObj<PageId>('sites');
	undo = signalObj<UndoState | null>(null);

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

	quoteLists = resourceObj(createResource(loadQuoteLists));
	selectedQuoteList = resourceObj(createResource(this.selectedQuoteListId.get, async (qlId) => {
		if (qlId == null) return null;
		return await loadQuoteList(qlId!);
	}));

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

		let permissionsEnabled = false;
		if (site != null) {
			const origins = originsForSite(site);
			permissionsEnabled = true;
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
}

export const OptionsPageStateContext = createContext<OptionsPageState>();
export const useOptionsPageState = () => assertDefined(useContext(OptionsPageStateContext));
