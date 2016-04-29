
var browser : any = require( 'browser-specific' );

import { Store as ReduxStore, createStore as createReduxStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import rootReducer, { IState } from './reducer';

export interface Store extends ReduxStore {
	getState() : IState;
}

function saveSettings( state: IState ) {
	const data = {
		showQuotes: state.showQuotes,
		featureIncrement: state.featureIncrement,
	};

	browser.saveSettings( data );
}

export function createStore() : Promise<Store> {
	return new Promise( ( resolve ) => {
		browser.loadSettings( ( initialState ) => {
			const store = createReduxStore( rootReducer, initialState, applyMiddleware( thunk ) );

			const autoSaveSettings = () => {
				saveSettings( store.getState() );
			}

			store.subscribe( autoSaveSettings );

			console.log( store.getState() );
			resolve( store );
		} );
	} );
}
