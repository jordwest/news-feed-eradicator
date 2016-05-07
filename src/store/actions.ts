
import * as redux from 'redux';

import { BuiltinQuotes } from '../quote';

enum ActionTypes {
	HIDE_INFO_PANEL = <any>'HIDE_INFO_PANEL',
	SHOW_INFO_PANEL = <any>'SHOW_INFO_PANEL',
	TOGGLE_SHOW_QUOTES = <any>'TOGGLE_SHOW_QUOTES',
	SELECT_NEW_QUOTE = <any>'SELECT_NEW_QUOTE',
	HIDE_QUOTE = <any>'HIDE_QUOTE',
}

import { IState } from './reducer';

interface ActionTypeObject {
	type: ActionTypes
}

export type ActionObject = ActionTypeObject;

export default ActionTypes;

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

export function selectBuiltinQuote() {
	return {
		type: ActionTypes.SELECT_NEW_QUOTE,
		isCustom: false,
		id: BuiltinQuotes[ Math.floor( Math.random() * BuiltinQuotes.length ) ].id,
	}
}

export function selectNewQuote() {
	return selectBuiltinQuote();
}

export function saveSettings() {
	return ( dispatch, getState ) => {
		const state : IState = getState();

		const data = {
			showQuotes: state.showQuotes,
			featureIncrement: state.featureIncrement,
		}

		console.log( 'saving settings', data );
	}
}
