export enum ActionType {
	TOGGLE_SHOW_QUOTES = 'TOGGLE_SHOW_QUOTES',
	TOGGLE_BUILTIN_QUOTES = 'TOGGLE_BUILTIN_QUOTES',
	SELECT_NEW_QUOTE = 'SELECT_NEW_QUOTE',
	QUOTE_HIDE = 'QUOTE_HIDE',
	QUOTE_DELETE = 'QUOTE_DELETE',
	QUOTE_ADD = 'QUOTE_ADD',
	QUOTE_ADD_BULK = 'QUOTE_ADD_BULK',
	QUOTE_EDIT = 'QUOTE_EDIT',
	QUOTE_SET = 'QUOTE_SET',
	QUOTE_SAVE_CLICKED = 'QUOTE_SAVE_CLICKED',
	QUOTE_REMOVE_CURRENT = 'QUOTE_REMOVE_CURRENT',
	RESET_HIDDEN_QUOTES = 'RESET_HIDDEN_QUOTES',
	QUOTE_MENU_SHOW = 'QUOTE_MENU_SHOW',
	PARSE_ERROR = 'PARSE_ERROR',
	UI_OPTIONS_SHOW = 'UI_OPTIONS_SHOW',
}

export type ActionObject =
	| ToggleShowQuotes
	| ToggleBuiltinQuotes
	| QuoteSelectNew
	| QuoteRemoveCurrent
	| QuoteMenuShow
	| QuoteEdit
	| QuoteHide
	| QuoteDelete
	| QuoteSet
	| QuoteAdd
	| QuoteSaveClicked
	| QuoteDelete
	| QuoteHide
	| QuoteAddBulk
	| QuoteResetHidden
	| QuoteBulkParseError
	| QuoteBulkParseError
	| UiOptionsShow;

export type UiOptionsShow = {
	type: ActionType.UI_OPTIONS_SHOW;
};
export type ToggleShowQuotes = {
	type: ActionType.TOGGLE_SHOW_QUOTES;
};
export type ToggleBuiltinQuotes = {
	type: ActionType.TOGGLE_BUILTIN_QUOTES;
};
export type QuoteSelectNew = {
	type: ActionType.SELECT_NEW_QUOTE;
};
export type QuoteResetHidden = {
	type: ActionType.RESET_HIDDEN_QUOTES;
};

export type QuoteRemoveCurrent = {
	type: ActionType.QUOTE_REMOVE_CURRENT;
};

export type QuoteMenuShow = {
	type: ActionType.QUOTE_MENU_SHOW;
	show: 'SHOW' | 'HIDE' | 'TOGGLE';
};

export type QuoteSaveClicked = {
	type: ActionType.QUOTE_SAVE_CLICKED;
};

export type QuoteAdd = {
	type: ActionType.QUOTE_ADD;
	id: string | number;
	text: string;
	source: string;
};

export type QuoteHide = { type: ActionType.QUOTE_HIDE; id: string | number };
export type QuoteDelete = {
	type: ActionType.QUOTE_DELETE;
	id: string | number;
};

export type QuoteAddBulk = {
	type: ActionType.QUOTE_ADD_BULK;
	text: string;
};

export type QuoteSet = {
	type: ActionType.QUOTE_SET;
	isCustom: boolean;
	id: string | number | undefined;
};

export type QuoteEdit = {
	type: ActionType.QUOTE_EDIT;
	action:
		| { type: 'START' }
		| { type: 'CANCEL' }
		| { type: 'SET_TEXT'; text: string }
		| { type: 'SET_SOURCE'; source: string }
		| { type: 'TOGGLE_BULK' };
};

export type QuoteBulkParseError = {
	type: ActionType.PARSE_ERROR;
	message: string;
};

export interface ActionTypeObject {
	type: ActionType;
}
