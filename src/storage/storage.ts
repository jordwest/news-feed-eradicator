import { generateId } from "../lib/generate-id";
import { getBrowser } from "../lib/webextension";
import type { Quote } from "../quote";
import type { RegionId, SiteId, SiteList } from "../types/sitelist";
import { type StorageSyncV1, SiteStateTagV1, type StorageLocal, type StorageLocalV2, CURRENT_STORAGE_SCHEMA_VERSION, type SiteConfig, type Theme, defaultQuoteLists, type QuoteListId, type QuoteList, BUILTIN_QUOTE_LIST_ID, type SnoozeMode } from "./schema";

const ensureMigrated = async (): Promise<void> => {
	const browser = getBrowser();

	const [storageSync, storageLocal] = await Promise.all([
		browser.storage.sync.get(null) as Promise<StorageSyncV1 | undefined>,
		browser.storage.local.get(null) as Promise<StorageLocalV2 | undefined>,
	]);

	if (storageSync?.version == null) {
		// Nothing stored in sync storage, nothing to migrate
		await browser.storage.local.set({ 'version': CURRENT_STORAGE_SCHEMA_VERSION });
		return;
	}

	if (storageSync.version != null && storageLocal?.version === 2) {
		// Leave sync storage in place in case older versions are running elsewhere
		return;
	}

	// Do migration
	let enabledSites: SiteId[] = []

	if (storageSync.sites != null) {
		enabledSites = Object.entries(storageSync.sites)
			.filter(([, state]) => state?.type !== SiteStateTagV1.DISABLED)
			.map(([siteId,]) => siteId as SiteId);
	}

	const quoteLists = ([] as QuoteList[]).concat(defaultQuoteLists());

	if (storageSync.customQuotes.length > 0) {
		quoteLists.push({
			id: 'migrated' as QuoteListId,
			title: 'Custom quotes from previous version',
			disabledQuoteIds: [],
			disabled: false,
			imported: false,
			quotes: storageSync.customQuotes.map(q => ({
				id: q.id,
				text: q.text,
				author: q.source, // Renamed source to author
			})),
		});
	}

	const migratedData: StorageLocalV2 = {
		version: 2,
		hideQuotes: storageSync.showQuotes === false,
		snoozeMode: 'instant', // Preserve original snooze behaviour for existing users
		quoteLists,
		enabledSites,
	}

	await browser.storage.local.set(migratedData);
};

export const migrationPromise = ensureMigrated();

async function getKey<Key extends keyof StorageLocal>(k: Key, defaultValue?: undefined): Promise<NonNullable<StorageLocalV2[Key]> | undefined>;
async function getKey<Key extends keyof StorageLocal>(k: Key, defaultValue?: NonNullable<StorageLocalV2[Key]>): Promise<NonNullable<StorageLocalV2[Key]>>;
async function getKey<Key extends keyof StorageLocal>(k: Key, defaultValue: NonNullable<StorageLocalV2[Key]> | undefined): Promise<NonNullable<StorageLocalV2[Key]> | undefined> {
	const browser = getBrowser();
	await migrationPromise;
	const result = await browser.storage.local.get(k);
	if (result == null) return defaultValue;
	if (result[k] == null) return defaultValue;
	return (result[k]) as NonNullable<StorageLocal[Key]>;
}

const setKey = async <Key extends keyof StorageLocal>(k: Key, val: StorageLocal[Key]): Promise<void> => {
	const browser = getBrowser();
	await migrationPromise;
	return await browser.storage.local.set({ [k]: val });
}

export const loadSettingsLocked = () => getKey('settingsLocked', false);
export const saveSettingsLocked = (settingsLocked: boolean) => setKey('settingsLocked', settingsLocked);

export const loadRegionHideStyle = () => getKey('regionHideStyle', 'hidden');
export const saveRegionHideStyle = (regionHideStyle: StorageLocalV2['regionHideStyle']) => setKey('regionHideStyle', regionHideStyle);

export const loadWidgetStyle = () => getKey('widgetStyle', 'contained');
export const saveWidgetStyle = (widgetTheme: StorageLocalV2['widgetStyle']) => setKey('widgetStyle', widgetTheme);

export const loadHideQuotes = () => getKey('hideQuotes', false);
export const saveHideQuotes = (hideQuotes: boolean) => setKey('hideQuotes', hideQuotes);
export const loadEnabledSites = () => getKey('enabledSites', []);

export const loadHideWidgetToolbar = () => getKey('hideWidgetToolbar', true);
export const saveHideWidgetToolbar = (hideWidgetToolbar: boolean) => setKey('hideWidgetToolbar', hideWidgetToolbar);

export const saveSiteEnabled = async (siteId: SiteId, enable: boolean): Promise<void> => {
	const s = await getKey('enabledSites', []);
	let sites = new Set(s ?? []);

	enable ? sites.add(siteId) : sites.delete(siteId);

	return setKey('enabledSites', Array.from(sites));
}

export const loadSnoozeUntil = () => getKey('snoozeUntil', undefined);
export const saveSnoozeUntil = (snoozeUntil: number | undefined) => setKey('snoozeUntil', snoozeUntil);

export const loadSnoozeMode = () => getKey('snoozeMode', 'hold');
export const saveSnoozeMode = (snoozeMode: SnoozeMode) => setKey('snoozeMode', snoozeMode);

export const loadSiteConfig = async (siteId: SiteId): Promise<SiteConfig | undefined> => {
	const sites = await getKey('siteConfig', {});
	return sites[siteId];
};

export const loadThemeForSite = async (siteId: SiteId): Promise<Theme | undefined> => loadSiteConfig(siteId).then(site => site?.theme);
export const saveThemeForSite = async (siteId: SiteId, theme: Theme | undefined) => {
	const siteConfig = (await getKey('siteConfig') ?? {});

	const site = siteConfig[siteId] ?? {
		regionEnabledOverride: {},
	};

	site.theme = theme;

	siteConfig[siteId] = site;
	return setKey('siteConfig', siteConfig);
}

export const loadRegionsForSite = async (siteId: SiteId): Promise<SiteConfig> => loadSiteConfig(siteId).then(site => site ?? { regionEnabledOverride: {} });

export const loadQuoteLists = async () => getKey('quoteLists', defaultQuoteLists());
export const loadQuoteList = async (id: QuoteListId) => loadQuoteLists().then(quoteLists => quoteLists.find(ql => ql.id === id));

export const deleteQuoteList = async (id: QuoteListId) => {
	if (id === BUILTIN_QUOTE_LIST_ID) {
		throw new Error('Cannot delete builtin quotes list');
	}

	let quoteLists = await loadQuoteLists();
	quoteLists = quoteLists.filter(ql => ql.id !== id);
	await setKey('quoteLists', quoteLists);
}

export const saveQuoteListTitle = async (id: QuoteListId, title: string) => {
	await editQuoteList(id, list => {
		list.title = title;
	});
}

export const deleteQuote = async (qlId: QuoteListId, id: string) => {
	await editQuoteList(qlId, list => {
		if (list.quotes === 'builtin') {
			return list;
		}

		list.quotes = list.quotes.filter(q => q.id !== id);
		return list;
	});
}

export const undoDeleteQuote = async (qlId: QuoteListId, quote: Quote) => {
	await editQuoteList(qlId, list => {
		if (list.quotes === 'builtin') {
			return list;
		}

		list.quotes.push(quote);
		return list;
	});
}

export const saveQuote = async (qlId: QuoteListId, id: string, text: string, author: string) => {
	await editQuoteList(qlId, list => {
		if (list.quotes === 'builtin') {
			throw new Error('Cannot save to builtin quotes list');
		}

		const quote = list.quotes.find(q => q.id === id);

		if (quote == null) {
			list.quotes.push({
				id,
				text,
				author,
			})
		} else {
			quote.text = text;
			quote.author = author;
		}
	});
}

const editQuoteList = async (quoteListId: QuoteListId, fn: (quoteList: QuoteList) => void) => {
	const lists = await loadQuoteLists();

	const list = lists.find(ql => ql.id === quoteListId);
	if (list == null) {
		throw new Error(`editQuoteList failed: Quote list not found ${quoteListId}`)
	}

	fn(list);

	await setKey('quoteLists', lists);
}

export const saveQuoteEnabled = async (quoteListId: QuoteListId, id: string, enabled: boolean) => {
	await editQuoteList(quoteListId, list => {
		list.disabledQuoteIds = list.disabledQuoteIds.filter(qid => qid !== id);
		if (!enabled) {
			list.disabledQuoteIds.push(id);
		}
	});
}

export const saveQuoteListEnabled = async (quoteListId: QuoteListId, enabled: boolean) => {
	await editQuoteList(quoteListId, list => list.disabled = !enabled);
}

export const saveNewQuoteList = async ({ title, quotes, imported, disabledQuoteIds }: { title: string, quotes: Quote[], imported: boolean, disabledQuoteIds: string[] }) => {
	const lists = await loadQuoteLists();

	const id = generateId() as QuoteListId;
	lists.push({
		id,
		disabled: false,
		title,
		quotes,
		imported,
		disabledQuoteIds,
	});

	await setKey('quoteLists', lists);

	return id;
}

export const undoDeleteQuoteList = async (quoteList: QuoteList) => {
	const lists = await loadQuoteLists();
	lists.push(quoteList);
	await setKey('quoteLists', lists);
}

export const clearRegionsForSite = async (siteId: SiteId): Promise<void> => {
	const siteConfig = (await getKey('siteConfig') ?? {});

	if (siteConfig[siteId] == null) {
		// Site config doesn't exist, nothing to clear
		return;
	}

	siteConfig[siteId].regionEnabledOverride = {};
	return setKey('siteConfig', siteConfig);
}

export const setRegionEnabledForSite = async (siteId: SiteId, regionId: RegionId, enabled: boolean) => {
	const siteConfig = (await getKey('siteConfig') ?? {});

	const site = siteConfig[siteId] ?? {
		regionEnabledOverride: {},
	};

	site.regionEnabledOverride[regionId] = enabled;

	siteConfig[siteId] = site;
	return setKey('siteConfig', siteConfig);
}

const browser = getBrowser();
const siteListUrl = browser.runtime.getURL('sitelist.json');
const siteListPromise: Promise<SiteList> = fetch(siteListUrl).then(siteList => siteList.json());

export const loadSitelist = async (): Promise<SiteList> => {
	return siteListPromise
}
