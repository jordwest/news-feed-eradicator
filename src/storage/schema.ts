import type { SiteId } from "../types/sitelist";
import type { CustomQuote } from "../quote";

export const CURRENT_STORAGE_SCHEMA_VERSION = 2;

/**
 * Data synced across devices
 */
export type StorageSyncV2 = {
	version: 2;
	hideQuotes?: boolean;
	disableBuiltinQuotes?: boolean;
	hiddenBuiltinQuotes?: number[];
	customQuotes?: CustomQuote[];
	enabledSites?: SiteId[];
	snoozeUntil?: number;
};

/**
 * Data stored only locally.
 * TODO v3.1 or later: Migrate custom quotes and site settings to local storage to support larger
 * storage.
 */
type StorageLocalV2 = {
	version: 2;
};

export type StorageAnyVersion = StorageSyncV1 | StorageSyncV2;

/**
 * Current version
 */
export type StorageSync = StorageSyncV2

///////// OLDER VERSIONS /////////

/**
 * Deprecated in v3.0.0
 */
export type StorageSyncV1 = {
	version: 1;
	showQuotes: boolean;
	builtinQuotesEnabled: boolean;
	featureIncrement: number;
	hiddenBuiltinQuotes: number[];
	customQuotes: CustomQuote[];
	sites: Partial<SitesStateV1>;
};

export type SitesStateV1 = Record<SiteId, SiteStateV1>;

export const enum SiteStateTagV1 {
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
