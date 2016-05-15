
import * as redux from 'redux';

import { getBuiltinQuotes } from './selectors';

enum ActionTypes {
	HIDE_INFO_PANEL = <any>'HIDE_INFO_PANEL',
	SHOW_INFO_PANEL = <any>'SHOW_INFO_PANEL',
	TOGGLE_SHOW_QUOTES = <any>'TOGGLE_SHOW_QUOTES',
	TOGGLE_BUILTIN_QUOTES = <any>'TOGGLE_BUILTIN_QUOTES',
	SELECT_NEW_QUOTE = <any>'SELECT_NEW_QUOTE',
	HIDE_QUOTE = <any>'HIDE_QUOTE',
	DELETE_QUOTE = <any>'DELETE_QUOTE',
	ADD_QUOTE = <any>'ADD_QUOTE',
	RESET_HIDDEN_QUOTES = <any>'RESET_HIDDEN_QUOTES',
}

import { IState } from './reducer';

interface ActionTypeObject {
	type: ActionTypes
}

export type ActionObject = ActionTypeObject;

export default ActionTypes;

function generateID() : string {
	let key = '';
	while ( key.length < 16 ) {
		key += Math.random().toString(16).substr(2);
	}
	return key.substr(0, 16);
}

export function hideInfoPanel() {
	return {
		type: ActionTypes.HIDE_INFO_PANEL
	};
}

export function showInfoPanel() {
	return {
		type: ActionTypes.SHOW_INFO_PANEL
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
