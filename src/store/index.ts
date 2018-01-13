
import * as browser from '../webextension'

import { Store as ReduxStore, createStore as createReduxStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import rootReducer, { IState } from './reducer';
import { selectNewQuote } from './actions';

export interface Store extends ReduxStore<IState> {
	getState() : IState;
}

function saveSettings( state: IState ) {
	const data = {
		showQuotes: state.showQuotes,
		builtinQuotesEnabled: state.builtinQuotesEnabled,
		featureIncrement: state.featureIncrement,
		hiddenBuiltinQuotes: state.hiddenBuiltinQuotes,
		customQuotes: state.customQuotes,
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

			resolve( store );
		} );
	} );
}
