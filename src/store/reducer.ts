
import { combineReducers } from 'redux';

import Actions, { ActionObject } from './actions';
import config from '../config';

function showQuotes( state = true, action: ActionObject ) {
	switch ( action.type ) {
		case Actions.TOGGLE_SHOW_QUOTES:
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

function shouldSaveSettings( state = false, action: ActionObject ) {
	switch ( action.type ) {
		case Actions.SHOW_INFO_PANEL:
		case Actions.TOGGLE_SHOW_QUOTES:
			return true;
	}
	return state;
}

export interface IState {
	showQuotes: boolean;
	showInfoPanel: boolean;
	featureIncrement: number;
}

export default combineReducers( {
	showQuotes,
	showInfoPanel,
	featureIncrement,
} );
