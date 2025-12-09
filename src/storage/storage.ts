import { getBrowser } from "../lib/webextension";
import type { SiteId } from "../types/sitelist";
import { type StorageAnyVersion, SiteStateTagV1, type StorageSync } from "./schema";

/**
 * Migrates storage from older versions (or empty) to the current version
 */
export const upgradeSyncStorage = (storage: Partial<StorageAnyVersion>): StorageSync => {
	if (storage.version === 2) return { version: 2, ...storage };

	if (storage.version === 1) {

		let enabledSites: SiteId[] = []

		if (storage.sites != null) {
			enabledSites = Object.entries(storage.sites)
				.filter(([, state]) => state?.type !== SiteStateTagV1.DISABLED)
				.map(([siteId,]) => siteId as SiteId);
		}

		return {
			version: 2,
			hideQuotes: storage.showQuotes === false,
			disableBuiltinQuotes: storage.builtinQuotesEnabled === false,
			hiddenBuiltinQuotes: storage.hiddenBuiltinQuotes,
			customQuotes: storage.customQuotes,
			enabledSites,
		}
	}

	// New version makes all properties optional
	return {
		version: 2,
	}
}

export const load = async (): Promise<StorageSync> => {
	const browser = getBrowser();
	const settings = await browser.storage.sync.get(null).then(upgradeSyncStorage);
	return settings;
}

export const save = async (storage: StorageSync) => {
	const browser = getBrowser();
	return browser.storage.sync.set(storage);
}

export const loadEnabledSites = async (): Promise<SiteId[]> => {
	const settings = await load();
	return (settings.enabledSites ?? []) as SiteId[];
}

export const saveSiteEnabled = async (siteId: SiteId, enable: boolean): Promise<void> => {
	const settings = await load();
	let sites = settings.enabledSites ?? [];

	if (enable) {
		if (!sites.includes(siteId)) {
			sites.push(siteId)
		}
	} else {
		sites = sites.filter(site => site !== siteId);
	}

	settings.enabledSites = sites;
	save(settings);
}
