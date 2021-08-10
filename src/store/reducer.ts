import { combineReducers } from 'redux';
import { ActionObject, ActionType, CurrentQuote } from './action-types';
import { SettingsState } from '../background/store/reducer';
import { OptionsState, optionsReducer } from './options/reducer';

function currentQuote(
	state: CurrentQuote | null = null,
	action: ActionObject
): CurrentQuote | null {
	switch (action.type) {
		case ActionType.QUOTE_CURRENT_SET:
			return action.quote;
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

const settings = (
	state: SettingsState | null = null,
	action: ActionObject
): SettingsState | null => {
	if (action.type === ActionType.BACKGROUND_SETTINGS_CHANGED) {
		return action.settings;
	}
	return state;
};

export interface IState {
	currentQuote: CurrentQuote | null;
	editingSource: string;
	editingText: string;
	isQuoteMenuVisible: boolean;
	isEditingQuote: boolean;
	isEditingBulk: boolean;
	error: string;
	settings: SettingsState | null;
	uiOptions: OptionsState;
}

export default combineReducers({
	currentQuote,
	editingSource,
	editingText,
	isQuoteMenuVisible,
	isEditingQuote,
	isEditingBulk,
	error,
	settings,
	uiOptions: optionsReducer,
});
