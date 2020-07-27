import {
	SettingsActionObject as ActionObject,
	SettingsActionType as ActionType,
} from './action-types';
import config from '../config';
import { CustomQuote } from '../quote';
import { combineReducers } from 'redux';

function showQuotes(state = true, action: ActionObject) {
	switch (action.type) {
		case ActionType.QUOTES_SHOW_TOGGLE:
			return !state;
	}
	return state;
}

function builtinQuotesEnabled(state = true, action: ActionObject) {
	switch (action.type) {
		case ActionType.QUOTES_BUILTIN_TOGGLE:
			return !state;
	}
	return state;
}

function featureIncrement(state = 0, action: ActionObject) {
	switch (action.type) {
		case ActionType.FEATURE_INCREMENT:
			return config.newFeatureIncrement;
	}
	return state;
}

function hiddenBuiltinQuotes(
	state: number[] = [],
	action: ActionObject
): number[] {
	switch (action.type) {
		case ActionType.QUOTE_HIDE:
			if (action.id == null) return state;
			if (typeof action.id !== 'number') throw new Error('id must be numeric');
			return state.concat([action.id]);
		case ActionType.QUOTE_HIDDEN_RESET:
			return [];
	}
	return state;
}

function customQuotes(
	state: CustomQuote[] = [],
	action: ActionObject
): CustomQuote[] {
	switch (action.type) {
		case ActionType.QUOTE_ADD:
			return state.concat([
				{
					id: action.id,
					text: action.text,
					source: action.source,
				},
			]);
		case ActionType.QUOTE_DELETE:
			if (action.id == null) return state;
			return state.filter(quote => quote.id !== action.id);
	}
	return state;
}

export type SettingsState = {
	showQuotes: boolean;
	builtinQuotesEnabled: boolean;
	featureIncrement: number;
	hiddenBuiltinQuotes: number[];
	customQuotes: CustomQuote[];
};

export default combineReducers({
	showQuotes,
	builtinQuotesEnabled,
	featureIncrement,
	hiddenBuiltinQuotes,
	customQuotes,
});
