import { combineReducers } from 'redux';

import { Quote } from '../quote';
import config from '../config';
import { ActionObject, ActionType } from './action-types';

function showQuotes(state = true, action: ActionObject) {
	switch (action.type) {
		case ActionType.TOGGLE_SHOW_QUOTES:
			return !state;
	}
	return state;
}

function builtinQuotesEnabled(state = true, action: ActionObject) {
	switch (action.type) {
		case ActionType.TOGGLE_BUILTIN_QUOTES:
			return !state;
	}
	return state;
}

function featureIncrement(state = 0, action: ActionObject) {
	switch (action.type) {
		case ActionType.UI_OPTIONS_SHOW:
			return config.newFeatureIncrement;
	}
	return state;
}

function isCurrentQuoteCustom(state = null, action: ActionObject) {
	switch (action.type) {
		case ActionType.QUOTE_SET:
			return action.isCustom;
		case ActionType.QUOTE_ADD:
			return true;
	}
	return state;
}

function currentQuoteID(state = null, action: ActionObject) {
	console.log('currentQuoteID', action);
	switch (action.type) {
		case ActionType.QUOTE_SET:
			return action.id;
		case ActionType.QUOTE_ADD:
			return action.id;
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
		case ActionType.RESET_HIDDEN_QUOTES:
			return [];
	}
	return state;
}

function customQuotes(state: Quote[] = [], action: ActionObject): Quote[] {
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

const editingText = (state: string = '', action: ActionObject) => {
	switch (action.type) {
		case ActionType.QUOTE_EDIT:
			switch (action.action.type) {
				case 'START':
					return '';
				case 'CANCEL':
					return '';
				case 'SET_TEXT':
					return action.action.text;
				case 'TOGGLE_BULK':
					return '';
			}
	}
	return state;
};

const editingSource = (state: string = '', action: ActionObject) => {
	switch (action.type) {
		case ActionType.QUOTE_EDIT:
			switch (action.action.type) {
				case 'START':
					return '';
				case 'CANCEL':
					return '';
				case 'SET_SOURCE':
					return action.action.source;
			}
	}
	return state;
};

const isQuoteMenuVisible = (state: boolean = false, action: ActionObject) => {
	switch (action.type) {
		case ActionType.QUOTE_MENU_SHOW:
			switch (action.show) {
				case 'SHOW':
					return true;
				case 'HIDE':
					return false;
				case 'TOGGLE':
					return !state;
			}
	}
	return state;
};

const isEditingQuote = (state: boolean = false, action: ActionObject) => {
	switch (action.type) {
		case ActionType.QUOTE_EDIT:
			switch (action.action.type) {
				case 'START':
					return true;
				case 'CANCEL':
					return false;
			}
	}
	return state;
};

const isEditingBulk = (state: boolean = false, action: ActionObject) => {
	switch (action.type) {
		case ActionType.QUOTE_EDIT:
			switch (action.action.type) {
				case 'TOGGLE_BULK':
					return !state;
			}
	}
	return state;
};

const error = (state: string = '', action: ActionObject) => {
	switch (action.type) {
		case ActionType.QUOTE_EDIT:
			switch (action.action.type) {
				case 'CANCEL':
					return '';
			}
			return state;
		case ActionType.PARSE_ERROR:
			return action.message;
	}
	return state;
};

export interface IState {
	showQuotes: boolean;
	builtinQuotesEnabled: boolean;
	featureIncrement: number;
	isCurrentQuoteCustom: boolean;
	currentQuoteID: number | string;
	hiddenBuiltinQuotes: number[];
	customQuotes: Quote[];
	editingSource: string;
	editingText: string;
	isQuoteMenuVisible: boolean;
	isEditingQuote: boolean;
	isEditingBulk: boolean;
	error: string;
}

export default combineReducers({
	showQuotes,
	builtinQuotesEnabled,
	featureIncrement,
	isCurrentQuoteCustom,
	currentQuoteID,
	hiddenBuiltinQuotes,
	customQuotes,
	editingSource,
	editingText,
	isQuoteMenuVisible,
	isEditingQuote,
	isEditingBulk,
	error,
});
