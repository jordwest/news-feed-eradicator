import { SettingsState } from './reducer';

export enum SettingsActionType {
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
}

export type SettingsActionObject =
	| FeatureIncrement
	| QuotesShowToggle
	| QuotesBuiltinToggle
	| QuoteHide
	| QuoteShow
	| QuoteDelete
	| QuoteAdd
	| QuoteHiddenReset
	| SettingsLoad
	| SettingsLoaded;

export type FeatureIncrement = { type: SettingsActionType.FEATURE_INCREMENT };

export type QuotesShowToggle = {
	type: SettingsActionType.QUOTES_SHOW_TOGGLE;
};

export type QuotesBuiltinToggle = {
	type: SettingsActionType.QUOTES_BUILTIN_TOGGLE;
};

export type QuoteHide = {
	type: SettingsActionType.QUOTE_HIDE;
	id: number;
};
export type QuoteShow = {
	type: SettingsActionType.QUOTE_SHOW;
	id: number;
};
export type QuoteDelete = {
	type: SettingsActionType.QUOTE_DELETE;
	id: string;
};

export type QuoteAdd = {
	type: SettingsActionType.QUOTE_ADD;
	id: string;
	text: string;
	source: string;
};

export type QuoteHiddenReset = {
	type: SettingsActionType.QUOTE_HIDDEN_RESET;
};

export type SettingsLoad = { type: SettingsActionType.SETTINGS_LOAD };
export type SettingsLoaded = {
	type: SettingsActionType.SETTINGS_LOADED;
	settings: SettingsState;
};
