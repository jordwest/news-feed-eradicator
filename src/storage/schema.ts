import type { RegionId, SiteId } from "../types/sitelist";
import type { Quote, QuoteV1 } from "../quote";

export const CURRENT_STORAGE_SCHEMA_VERSION = 2;

export type QuoteListId = ('builtin' | string) & { __quoteListId: never };

export type SnoozeMode = 'instant' | 'hold';

export type StorageLocalV2 = {
	version: 2;
	hideQuotes?: boolean;
	hideWidgetToolbar?: boolean;
	snoozeMode?: SnoozeMode;
	settingsLocked?: boolean;
	enabledSites?: SiteId[];
	siteConfig?: Record<SiteId, SiteConfig>;
	snoozeUntil?: number;
	quoteLists?: QuoteList[];
};

export type QuoteList = {
	id: QuoteListId;
	disabled: boolean;
	disabledQuoteIds: string[];
	title: string;
	imported: boolean;
	quotes: 'builtin' | Quote[];
};

export type SiteConfig = {
	theme?: Theme;
	// Overrides the enabled state from the sitelist if set
	regionEnabledOverride: Record<RegionId, boolean>;
};

export const BUILTIN_QUOTE_LIST_ID = 'builtin' as QuoteListId;

// Needs to be a function so a new reference is returned each time, otherwise Solid JS mutates the object in a store
export const defaultQuoteLists = (): QuoteList[] => [
	{
		id: BUILTIN_QUOTE_LIST_ID,
		disabled: false,
		disabledQuoteIds: [],
		title: '',
		imported: false,
		quotes: 'builtin',
	},
	{
		id: 'custom' as QuoteListId,
		disabled: false,
		disabledQuoteIds: [],
		title: 'Custom quotes',
		imported: false,
		quotes: [],
	}
];

export type Theme = 'light' | 'dark';

export type StorageLocal = StorageLocalV2;

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
	customQuotes: QuoteV1[];
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
