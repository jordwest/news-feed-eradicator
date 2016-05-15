
import { combineReducers } from 'redux';

import { Quote } from '../quote';
import Actions, { ActionObject } from './actions';
import config from '../config';

function showQuotes( state = true, action: ActionObject ) {
	switch ( action.type ) {
		case Actions.TOGGLE_SHOW_QUOTES:
			return !state;
	}
	return state;
}

function builtinQuotesEnabled( state = true, action ) {
	switch ( action.type ) {
		case Actions.TOGGLE_BUILTIN_QUOTES:
			return !state;
	}
	return state;
}

function showInfoPanel( state = false, action: ActionObject ) {
	switch ( action.type ) {
		case Actions.SHOW_INFO_PANEL:
			return true;
		case Actions.HIDE_INFO_PANEL:
			return false;
	}
	return state;
}

function featureIncrement( state = 0, action: ActionObject ) {
	switch ( action.type ) {
		case Actions.SHOW_INFO_PANEL:
			state = config.newFeatureIncrement;
	}
	return state;
}

function isCurrentQuoteCustom( state = null, action ) {
	switch ( action.type ) {
		case Actions.SELECT_NEW_QUOTE:
			return action.isCustom;
		case Actions.ADD_QUOTE:
			return true;
	}
	return state;
}

function currentQuoteID( state = null, action ) {
	switch ( action.type ) {
		case Actions.SELECT_NEW_QUOTE:
			return action.id;
		case Actions.ADD_QUOTE:
			return action.id;
	}
	return state;
}

function hiddenBuiltinQuotes( state: number[] = [], action ) : number[] {
	switch ( action.type ) {
		case Actions.HIDE_QUOTE:
			if ( action.id == null ) return state;
			return state.concat( [ action.id ] );
		case Actions.RESET_HIDDEN_QUOTES:
			return [];
	}
	return state;
}

function customQuotes( state: Quote[] = [], action ) : Quote[] {
	switch ( action.type ) {
		case Actions.ADD_QUOTE:
			return state.concat( [ {
				id: action.id,
				text: action.text,
				source: action.source,
			} ] );
		case Actions.DELETE_QUOTE:
			if ( action.id == null ) return state;
			return state.filter( quote => quote.id !== action.id );
	}
	return state;
}

export interface IState {
	showQuotes: boolean;
	builtinQuotesEnabled: boolean;
	showInfoPanel: boolean;
	featureIncrement: number;
	isCurrentQuoteCustom: boolean;
	currentQuoteID: number | string;
	hiddenBuiltinQuotes: number[],
	customQuotes: Quote[];
}

export default combineReducers( {
	showQuotes,
	builtinQuotesEnabled,
	showInfoPanel,
	featureIncrement,
	isCurrentQuoteCustom,
	currentQuoteID,
	hiddenBuiltinQuotes,
	customQuotes,
} );
