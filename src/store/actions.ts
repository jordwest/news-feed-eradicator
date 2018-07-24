
import * as redux from 'redux';

import { getBuiltinQuotes } from './selectors';

enum ActionTypes {
	TOGGLE_SHOW_QUOTES = <any>'TOGGLE_SHOW_QUOTES',
	TOGGLE_BUILTIN_QUOTES = <any>'TOGGLE_BUILTIN_QUOTES',
	SELECT_NEW_QUOTE = <any>'SELECT_NEW_QUOTE',
	HIDE_QUOTE = <any>'HIDE_QUOTE',
	DELETE_QUOTE = <any>'DELETE_QUOTE',
	ADD_QUOTE = <any>'ADD_QUOTE',
	RESET_HIDDEN_QUOTES = <any>'RESET_HIDDEN_QUOTES',
}

interface INFO_PANEL_SHOW {
	type: "INFO_PANEL_SHOW",
	show: "SHOW" | "HIDE" | "TOGGLE"
}

interface QUOTE_MENU_SHOW {
	type: "QUOTE_MENU_SHOW",
	show: "SHOW" | "HIDE" | "TOGGLE"
}

interface QUOTE_EDIT {
	type: "QUOTE_EDIT",
	action: { type: "START" }
		  | { type: "START_BULK" }
		  | { type: "CANCEL" }
		  | { type: "SET_TEXT", text: string }
		  | { type: "SET_SOURCE", source: string }
}

import { IState } from './reducer';

interface ActionTypeObject {
	type: ActionTypes
}

export type ActionObject = QUOTE_MENU_SHOW
						 | INFO_PANEL_SHOW
						 | QUOTE_EDIT

export default ActionTypes;

function generateID() : string {
	let key = '';
	while ( key.length < 16 ) {
		key += Math.random().toString(16).substr(2);
	}
	return key.substr(0, 16);
}

export function hideInfoPanel() : INFO_PANEL_SHOW {
	return {
		type: "INFO_PANEL_SHOW",
		show: "HIDE"
	};
}

export function showInfoPanel() : INFO_PANEL_SHOW {
	return {
		type: "INFO_PANEL_SHOW",
		show: "SHOW"
	};
}

export function toggleShowQuotes() {
	return {
		type: ActionTypes.TOGGLE_SHOW_QUOTES
	};
}

export function toggleBuiltinQuotes() {
	return ( dispatch ) => {
		dispatch( {
			type: ActionTypes.TOGGLE_BUILTIN_QUOTES
		} );

		dispatch( selectNewQuote() );
	}
}

export function addQuote( text: string, source: string ) {
	const id = generateID();
	return {
		type: ActionTypes.ADD_QUOTE,
		id,
		text,
		source,
	}
}

export function resetHiddenQuotes() {
	return {
		type: ActionTypes.RESET_HIDDEN_QUOTES,
	};
}

export function removeCurrentQuote() {
	return ( dispatch, getState ) => {
		const state : IState = getState();
		if ( state.isCurrentQuoteCustom ) {
			dispatch( {
				type: ActionTypes.DELETE_QUOTE,
				id: state.currentQuoteID,
			} );
		} else {
			dispatch( {
				type: ActionTypes.HIDE_QUOTE,
				id: state.currentQuoteID,
			} );
		}

		dispatch( selectNewQuote() );
	}
}

export function selectNewQuote() {
	return ( dispatch, getState ) => {
		const state : IState = getState();
		const builtinQuotes = getBuiltinQuotes( state );
		const customQuotes = state.customQuotes;
		const allQuotes = builtinQuotes.concat( customQuotes );
		if ( allQuotes.length < 1 ) {
			return dispatch( {
				type: ActionTypes.SELECT_NEW_QUOTE,
				isCustom: false,
				id: null,
			} );
		}

		const quoteIndex = Math.floor( Math.random() * allQuotes.length );
		dispatch( {
			type: ActionTypes.SELECT_NEW_QUOTE,
			isCustom: ( quoteIndex >= builtinQuotes.length ),
			id: allQuotes[ quoteIndex ].id,
		} );
	}
}

export function setQuoteText(text) : QUOTE_EDIT {
	return {
		type: "QUOTE_EDIT",
		action: { type: "SET_TEXT", text: text }
	}
}

export function setQuoteSource(source) : QUOTE_EDIT {
	return {
		type: "QUOTE_EDIT",
		action: { type: "SET_SOURCE", source }
	}
}

export function startEditing() : QUOTE_EDIT {
	return {
		type: "QUOTE_EDIT",
		action: { type: "START" }
	}
}

export function cancelEditing() : QUOTE_EDIT {
	return {
		type: "QUOTE_EDIT",
		action: { type: "CANCEL" }
	}
}

export const menuHide = () : QUOTE_MENU_SHOW => ({
	type: "QUOTE_MENU_SHOW",
	show: "HIDE"
})

export const menuToggle = () : QUOTE_MENU_SHOW => ({
	type: "QUOTE_MENU_SHOW",
	show: "TOGGLE"
})

export function startBulkEdit() : QUOTE_EDIT {
	return {
		type: "QUOTE_EDIT",
		action: { type: "START_BULK" }
	}
}
