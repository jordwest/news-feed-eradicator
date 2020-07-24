import * as browser from '../webextension';

import { createStore as createReduxStore, applyMiddleware } from 'redux';

import rootReducer, { IState } from './reducer';
import { selectNewQuote } from './actions';
import { effectsMiddleware } from '../lib/redux-effects';
import { ActionObject } from './action-types';
import { rootEffect } from './effects';

export type Store = {
	getState(): IState;
	subscribe(cb: () => void): void;
	dispatch(action: ActionObject): void;
};

function saveSettings(state: IState) {
	const data = {
		showQuotes: state.showQuotes,
		builtinQuotesEnabled: state.builtinQuotesEnabled,
		featureIncrement: state.featureIncrement,
		hiddenBuiltinQuotes: state.hiddenBuiltinQuotes,
		customQuotes: state.customQuotes,
	};

	browser.saveSettings(data);
}

export function createStore(): Promise<Store> {
	return new Promise(resolve => {
		browser.loadSettings((initialState: IState) => {
			const store: Store = createReduxStore(
				rootReducer,
				initialState,
				applyMiddleware(effectsMiddleware(rootEffect))
			);

			store.dispatch(selectNewQuote());

			store.subscribe(() => {
				saveSettings(store.getState());
			});

			resolve(store);
		});
	});
}
