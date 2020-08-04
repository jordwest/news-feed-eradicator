import { createStore as createReduxStore, applyMiddleware } from 'redux';

import rootReducer, { IState } from './reducer';
import { effectsMiddleware } from '../lib/redux-effects';
import { ActionObject, ActionType } from './action-types';
import { rootEffect } from './effects';

export type Store = {
	getState(): IState;
	subscribe(cb: () => void): void;
	dispatch(action: ActionObject): void;
};

export function createStore(): Store {
	const store: Store = createReduxStore(
		rootReducer,
		undefined,
		applyMiddleware(effectsMiddleware(rootEffect))
	);

	store.dispatch({ type: ActionType.UI_SITES_ENABLED_CHECK });

	return store;
}
