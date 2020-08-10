import {
	ActionType,
	QuoteEdit,
	QuoteMenuShow,
	QuoteSelectNew,
	QuoteRemoveCurrent,
	QuoteAddBulk,
	SettingsAction,
	UiOptionsShow,
} from './action-types';
import { SettingsActionType } from '../background/store/action-types';

export function addQuote(
	id: string,
	text: string,
	source: string
): SettingsAction {
	return {
		type: ActionType.SETTINGS_ACTION,
		action: {
			type: SettingsActionType.QUOTE_ADD,
			id,
			text,
			source,
		},
	};
}

export function removeCurrentQuote(): QuoteRemoveCurrent {
	return { type: ActionType.QUOTE_REMOVE_CURRENT };
}

export function selectNewQuote(): QuoteSelectNew {
	return { type: ActionType.SELECT_NEW_QUOTE };
}

export function setQuoteText(text: string): QuoteEdit {
	return {
		type: ActionType.QUOTE_EDIT,
		action: { type: 'SET_TEXT', text: text },
	};
}

export function setQuoteSource(source: string): QuoteEdit {
	return {
		type: ActionType.QUOTE_EDIT,
		action: { type: 'SET_SOURCE', source },
	};
}

export function startEditing(): QuoteEdit {
	return {
		type: ActionType.QUOTE_EDIT,
		action: { type: 'START' },
	};
}

export function cancelEditing(): QuoteEdit {
	return {
		type: ActionType.QUOTE_EDIT,
		action: { type: 'CANCEL' },
	};
}

export const menuHide = (): QuoteMenuShow => ({
	type: ActionType.QUOTE_MENU_SHOW,
	show: 'HIDE',
});

export const menuToggle = (): QuoteMenuShow => ({
	type: ActionType.QUOTE_MENU_SHOW,
	show: 'TOGGLE',
});

export function toggleBulkEdit(): QuoteEdit {
	return {
		type: ActionType.QUOTE_EDIT,
		action: { type: 'TOGGLE_BULK' },
	};
}

export function addQuotesBulk(text: string): QuoteAddBulk {
	return { type: ActionType.QUOTE_ADD_BULK, text };
}

export const showOptions = (): UiOptionsShow => ({
	type: ActionType.UI_OPTIONS_SHOW,
});
