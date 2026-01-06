import { generateId } from "../lib/generate-id";
import { getBrowser } from "../lib/webextension";
import type { Quote } from "../quote";
import type { RegionId, SiteId, SiteList } from "../types/sitelist";
import { type StorageSyncV1, SiteStateTagV1, type StorageLocal, type StorageLocalV2, CURRENT_STORAGE_SCHEMA_VERSION, type SiteConfig, type Theme, DEFAULT_QUOTE_LISTS, type QuoteListId, type QuoteList, BUILTIN_QUOTE_LIST_ID } from "./schema";

const ensureMigrated = async (): Promise<void> => {
	const browser = getBrowser();

	const storageSync = await browser.storage.sync.get(null) as StorageSyncV1 | undefined;
	const storageLocal = await browser.storage.local.get(null) as StorageLocalV2 | undefined;

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

	const quoteLists = ([] as QuoteList[]).concat(DEFAULT_QUOTE_LISTS);

	if (storageSync.customQuotes.length > 0) {
		quoteLists.push({
			id: 'migrated' as QuoteListId,
			title: 'Migrated from previous version',
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
		quoteLists,
		enabledSites,
	}

	await browser.storage.local.set(migratedData);
};

export const migrationPromise = ensureMigrated();

const getKey = async <Key extends keyof StorageLocal>(k: Key): Promise<StorageLocal[Key] | undefined> => {
	const browser = getBrowser();
	await migrationPromise;
	const result = await browser.storage.local.get(k);
	if (result == null) return undefined;
	return (result[k]) as StorageLocal[Key];
}

const setKey = async <Key extends keyof StorageLocal>(k: Key, val: StorageLocal[Key]): Promise<void> => {
	const browser = getBrowser();
	await migrationPromise;
	return await browser.storage.local.set({ [k]: val });
}

export const loadHideQuotes = async (): Promise<boolean> => {
	return await getKey('hideQuotes') ?? false;
};

export const saveHideQuotes = async (hideQuotes: boolean): Promise<void> => {
	await setKey('hideQuotes', hideQuotes);
};

export const loadEnabledSites = async (): Promise<SiteId[]> => {
	return await getKey('enabledSites') ?? [];
};

export const saveSiteEnabled = async (siteId: SiteId, enable: boolean): Promise<void> => {
	const s = await getKey('enabledSites');
	let sites = new Set(s ?? []);

	enable ? sites.add(siteId) : sites.delete(siteId);

	return setKey('enabledSites', Array.from(sites));
}

export const loadSnoozeUntil = () => getKey('snoozeUntil');
export const saveSnoozeUntil = (snoozeUntil: number | undefined) => setKey('snoozeUntil', snoozeUntil);

export const loadThemeForSite = async (siteId: SiteId): Promise<Theme | undefined> => {
	return (await getKey('siteConfig') ?? {})[siteId]?.theme;
}

export const saveThemeForSite = async (siteId: SiteId, theme: Theme | undefined) => {
	const siteConfig = (await getKey('siteConfig') ?? {});

	const site = siteConfig[siteId] ?? {
		regionEnabledOverride: {},
	};

	site.theme = theme;

	siteConfig[siteId] = site;
	return setKey('siteConfig', siteConfig);
}

export const loadRegionsForSite = async (siteId: SiteId): Promise<SiteConfig> => {
	return (await getKey('siteConfig') ?? {})[siteId] ?? {
		regionEnabledOverride: {}
	};
}

export const loadQuoteLists = async () => {
	return (await getKey('quoteLists')) ?? DEFAULT_QUOTE_LISTS;
}

export const loadQuoteList = async (id: QuoteListId) => {
	return ((await getKey('quoteLists')) ?? DEFAULT_QUOTE_LISTS).find(ql => ql.id === id);
}

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

export const saveNewQuoteList = async (title: string, quotes: Quote[], imported: boolean) => {
	const lists = await loadQuoteLists();

	const id = generateId() as QuoteListId;
	lists.push({
		id,
		disabled: false,
		title,
		quotes,
		imported,
		disabledQuoteIds: [],
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
