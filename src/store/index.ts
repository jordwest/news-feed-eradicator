import * as browser from '../webextension';

import { createStore as createReduxStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { ThunkAction } from 'redux-thunk';

import rootReducer, { IState } from './reducer';
import { selectNewQuote, ActionTypeObject, ActionObject } from './actions';

export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	IState,
	unknown,
	ActionTypeObject | ActionObject
>;

export type Store = {
	getState(): IState;
	subscribe(cb: () => void): void;
	dispatch(action: ActionObject | ActionTypeObject | AppThunk): void;
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
				applyMiddleware(thunk)
			);

			store.dispatch(selectNewQuote());

			store.subscribe(() => {
				saveSettings(store.getState());
			});

			resolve(store);
		});
	});
}
