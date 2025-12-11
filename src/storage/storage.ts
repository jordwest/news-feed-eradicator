import { getBrowser } from "../lib/webextension";
import type { RegionId, SiteId, SiteList } from "../types/sitelist";
import { type StorageSyncV1, SiteStateTagV1, type StorageLocal, type StorageLocalV2, CURRENT_STORAGE_SCHEMA_VERSION, type SiteConfig } from "./schema";

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

	const migratedData = {
		version: 2,
		hideQuotes: storageSync.showQuotes === false,
		disableBuiltinQuotes: storageSync.builtinQuotesEnabled === false,
		hiddenBuiltinQuotes: storageSync.hiddenBuiltinQuotes,
		customQuotes: storageSync.customQuotes,
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

export const saveSiteEnabled = async (siteId: SiteId, enable: boolean): Promise<void> => {
	const s = await getKey('enabledSites');
	let sites = new Set(s ?? []);

	enable ? sites.add(siteId) : sites.delete(siteId);

	return setKey('enabledSites', Array.from(sites));
}

export const loadHiddenBuiltinQuotes = async (): Promise<number[]> => {
	return await getKey('hiddenBuiltinQuotes') ?? [];
}

export const saveHiddenBuiltinQuote = async (quoteId: number, hidden: boolean): Promise<void> => {
	let hiddenQuotes = new Set(await getKey('hiddenBuiltinQuotes'));

	hidden ? hiddenQuotes.add(quoteId) : hiddenQuotes.delete(quoteId);

	return setKey('hiddenBuiltinQuotes', Array.from(hiddenQuotes));
}

export const loadRegionsForSite = async (siteId: SiteId): Promise<SiteConfig> => {
	return (await getKey('siteConfig') ?? {})[siteId] ?? {
		regionEnabledOverride: {}
	};
}

export const loadSnoozeUntil = () => getKey('snoozeUntil');
export const saveSnoozeUntil = (snoozeUntil: number | undefined) => setKey('snoozeUntil', snoozeUntil);

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
