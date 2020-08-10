import { SettingsState } from './reducer';
import { SiteId } from '../../sites';
import { SiteState } from './sites/reducer';

export enum BackgroundActionType {
	QUOTES_SHOW_TOGGLE = 'QUOTES_SHOW_TOGGLE',
	QUOTES_BUILTIN_TOGGLE = 'QUOTES_BUILTIN_TOGGLE',
	QUOTE_HIDE = 'QUOTE_HIDE',
	QUOTE_SHOW = 'QUOTE_SHOW',
	QUOTE_HIDDEN_RESET = 'QUOTE_HIDDEN_RESET',
	QUOTE_DELETE = 'QUOTE_DELETE',
	QUOTE_ADD = 'QUOTE_ADD',
	FEATURE_INCREMENT = 'FEATURE_INCREMENT',
	SETTINGS_LOAD = 'SETTINGS_LOAD',
	SETTINGS_LOADED = 'SETTINGS_LOADED',
	SITES_ENABLED_CHECK = 'sites/enabled/check',
	SITES_ENABLED_UPDATE = 'sites/enabled/update',
}

export type BackgroundActionObject =
	| FeatureIncrement
	| QuotesShowToggle
	| QuotesBuiltinToggle
	| QuoteHide
	| QuoteShow
	| QuoteDelete
	| QuoteAdd
	| QuoteHiddenReset
	| SettingsLoad
	| SettingsLoaded
	| SitesEnabledCheck
	| SitesEnabledUpdate;

export type FeatureIncrement = { type: BackgroundActionType.FEATURE_INCREMENT };

export type QuotesShowToggle = {
	type: BackgroundActionType.QUOTES_SHOW_TOGGLE;
};

export type QuotesBuiltinToggle = {
	type: BackgroundActionType.QUOTES_BUILTIN_TOGGLE;
};

export type QuoteHide = {
	type: BackgroundActionType.QUOTE_HIDE;
	id: number;
};
export type QuoteShow = {
	type: BackgroundActionType.QUOTE_SHOW;
	id: number;
};
export type QuoteDelete = {
	type: BackgroundActionType.QUOTE_DELETE;
	id: string;
};

export type QuoteAdd = {
	type: BackgroundActionType.QUOTE_ADD;
	id: string;
	text: string;
	source: string;
};

export type QuoteHiddenReset = {
	type: BackgroundActionType.QUOTE_HIDDEN_RESET;
};

export type SettingsLoad = { type: BackgroundActionType.SETTINGS_LOAD };
export type SettingsLoaded = {
	type: BackgroundActionType.SETTINGS_LOADED;
	settings: SettingsState;
};

export type SitesEnabledCheck = {
	type: BackgroundActionType.SITES_ENABLED_CHECK;
};
export type SitesEnabledUpdate = {
	type: BackgroundActionType.SITES_ENABLED_UPDATE;
	sitesEnabled: Record<SiteId, SiteState>;
};
