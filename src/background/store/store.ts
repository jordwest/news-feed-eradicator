import { createStore as createReduxStore, applyMiddleware } from 'redux';
import { effectsMiddleware } from '../../lib/redux-effects';
import { rootEffect } from './effects';
import rootReducer, { BackgroundState } from './reducer';
import { BackgroundActionObject, BackgroundActionType } from './action-types';

export type BackgroundStore = {
	getState(): BackgroundState;
	subscribe(cb: () => void): void;
	dispatch(action: BackgroundActionObject): void;
};

export function createBackgroundStore(): BackgroundStore {
	const store: BackgroundStore = createReduxStore(
		rootReducer,
		{ ready: false },
		applyMiddleware(effectsMiddleware(rootEffect))
	);

	store.dispatch({ type: BackgroundActionType.SETTINGS_LOAD });

	return store;
}
