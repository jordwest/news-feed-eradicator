import { combineReducers } from 'redux';
import {
	UiOptionsTabShow,
	UiOptionsQuoteTabShow,
	ActionObject,
	ActionType,
} from '../action-types';
import { SiteId } from '../../sites';

const confirmDisableSite = (
	state: SiteId | null = null,
	action: ActionObject
): SiteId | null => {
	switch (action.type) {
		case ActionType.UI_SITES_SITE_DISABLE_CONFIRM_SHOW:
			if (state === action.site) return null;
			return action.site;
		case ActionType.UI_SITES_SITE_DISABLE_CONFIRMED:
			return null;
	}
	return state;
};

const tab = (
	state: UiOptionsTabShow['tab'] | undefined = 'sites',
	action: ActionObject
) => {
	if (action.type === ActionType.UI_OPTIONS_TAB_SHOW) {
		return action.tab;
	}
	return state;
};
const quotesTab = (
	state: UiOptionsQuoteTabShow['tab'] | undefined = 'custom',
	action: ActionObject
) => {
	if (action.type === ActionType.UI_OPTIONS_QUOTE_TAB_SHOW) {
		return action.tab;
	}
	// Deactivate builtin quotes tab if they've been disabled
	if (
		action.type === ActionType.BACKGROUND_SETTINGS_CHANGED &&
		action.settings.builtinQuotesEnabled === false &&
		state === 'builtin'
	) {
		return 'custom';
	}
	return state;
};

export type OptionsState = {
	confirmDisableSite: SiteId | null;
	tab: UiOptionsTabShow['tab'];
	quotesTab: UiOptionsQuoteTabShow['tab'];
};

export const optionsReducer = combineReducers({
	confirmDisableSite,
	tab,
	quotesTab,
});
