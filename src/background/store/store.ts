import { createStore as createReduxStore, applyMiddleware } from 'redux';
import { effectsMiddleware } from '../../lib/redux-effects';
import { rootEffect } from './effects';
import rootReducer, { SettingsRoot } from './reducer';
import { SettingsActionObject, SettingsActionType } from './action-types';

export type SettingsStore = {
	getState(): SettingsRoot;
	subscribe(cb: () => void): void;
	dispatch(action: SettingsActionObject): void;
};

export function createSettingsStore(): SettingsStore {
	const store: SettingsStore = createReduxStore(
		rootReducer,
		{ ready: false },
		applyMiddleware(effectsMiddleware(rootEffect))
	);

	store.dispatch({ type: SettingsActionType.SETTINGS_LOAD });

	return store;
}
