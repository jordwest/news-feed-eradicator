
var browser : any = require( 'browser-specific' );

import { Store as ReduxStore, createStore as createReduxStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import rootReducer, { IState } from './reducer';
import { selectNewQuote } from './actions';

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

			store.dispatch( selectNewQuote() );

			store.subscribe( () => {
				saveSettings( store.getState() );
			} );

			console.log( store.getState() );
			resolve( store );
		} );
	} );
}
