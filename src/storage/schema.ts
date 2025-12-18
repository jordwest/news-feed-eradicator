import type { Region, RegionId, SiteId } from "../types/sitelist";
import type { CustomQuote } from "../quote";

export const CURRENT_STORAGE_SCHEMA_VERSION = 2;

export type QuoteListId = ('builtin' | string) & { __quoteListId: never };

export type StorageLocalV2 = {
	version: 2;
	hideQuotes?: boolean;
	enabledSites?: SiteId[];
	siteConfig?: Record<SiteId, SiteConfig>;
	snoozeUntil?: number;
	quoteLists?: QuoteList[];
};

export type QuoteList = {
	id: QuoteListId;
	disabled: boolean;
	ignoredQuoteIds: string[];
	title: string;
	imported: boolean;
	quotes: 'builtin' | CustomQuote[];
};

export type SiteConfig = {
	theme?: Theme;
	// Overrides the enabled state from the sitelist if set
	regionEnabledOverride: Record<RegionId, boolean>;
};

export const BUILTIN_QUOTE_LIST_ID = 'builtin' as QuoteListId;
export const DEFAULT_QUOTE_LISTS: QuoteList[] = [
	{
		id: BUILTIN_QUOTE_LIST_ID,
		disabled: false,
		ignoredQuoteIds: [],
		title: '',
		imported: false,
		quotes: 'builtin',
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
