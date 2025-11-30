import type { CustomQuote } from "../quote";
import type { SiteId } from "./sitelist";

/**
 * Deprecated in v3.0.0
 */
type StorageV1 = {
	version: 1;
	showQuotes: boolean;
	builtinQuotesEnabled: boolean;
	featureIncrement: number;
	hiddenBuiltinQuotes: number[];
	customQuotes: CustomQuote[];
	sites: Partial<SitesStateV1>;
};

/**
 * Current version
 */
type StorageV2 = {
	version: 2;
	hideQuotes?: boolean;
	disableBuiltinQuotes?: boolean;
	hiddenBuiltinQuotes?: number[];
	customQuotes?: CustomQuote[];
	enabledSites?: SiteId[];
	snoozeUntil?: number;
};

type Storage = StorageV1 | StorageV2;

/**
 * Migrates storage from older versions (or empty) to the current version
 */
export const upgradeStorage = (storage: Partial<Storage>): StorageV2 => {
	if (storage.version === 2) return { version: 2, ...storage };
	if (storage.version === 1) {
		return {
			version: 2,
			hideQuotes: storage.showQuotes === false,
			disableBuiltinQuotes: storage.builtinQuotesEnabled === false,
			hiddenBuiltinQuotes: storage.hiddenBuiltinQuotes,
			customQuotes: storage.customQuotes,
			enabledSites: storage.sites ? Object.keys(storage.sites) as SiteId[] : [],
		}
	}

	// New version makes all properties optional
	return {
		version: 2,
	}
}

export type SitesStateV1 = Record<SiteId, SiteStateV1>;

export enum SiteStateTagV1 {
	ENABLED = 'enabled',
	CHECK_PERMISSIONS = 'check_permissions',
	DISABLED = 'disabled',
	DISABLED_TEMPORARILY = 'disabled_temporarily',
}

export type SiteStateV1 =
	| { type: SiteStateTagV1.ENABLED }
	| { type: SiteStateTagV1.DISABLED }
	| { type: SiteStateTagV1.CHECK_PERMISSIONS }
	| { type: SiteStateTagV1.DISABLED_TEMPORARILY; disabled_until: number };
