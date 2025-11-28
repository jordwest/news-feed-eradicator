import { CustomQuote } from '../../quote';
import { Permissions } from '../../webextension';
import { SiteId } from '../../sites';
import { Settings } from './index';

export type SettingsState = {
	showQuotes: boolean;
	builtinQuotesEnabled: boolean;
	featureIncrement: number;
	hiddenBuiltinQuotes: number[];
	customQuotes: CustomQuote[];
	sites: Record<SiteId, Settings.SiteState>;
	permissions: Permissions;
};

export type BackgroundState =
	| { ready: false }
	| {
			ready: true;
			settings: SettingsState;
	  };