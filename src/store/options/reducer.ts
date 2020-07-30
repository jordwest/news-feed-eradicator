import { combineReducers } from 'redux';
import {
	UiOptionsTabShow,
	UiOptionsQuoteTabShow,
	ActionObject,
	ActionType,
} from '../action-types';

const tab = (
	state: UiOptionsTabShow['tab'] | undefined = 'quotes',
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
		action.type === ActionType.SETTINGS_CHANGED &&
		action.settings.builtinQuotesEnabled === false &&
		state === 'builtin'
	) {
		return 'custom';
	}
	return state;
};

export type OptionsState = {
	tab: UiOptionsTabShow['tab'];
	quotesTab: UiOptionsQuoteTabShow['tab'];
};

export const optionsReducer = combineReducers({
	tab,
	quotesTab,
});
