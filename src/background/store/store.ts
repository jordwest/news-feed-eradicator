import { configureStore, UnknownAction } from '@reduxjs/toolkit';
import { effectsMiddleware } from '../../lib/redux-effects';
import { rootEffect } from './effects';
import { settingsReducer, settingsLoad } from './slices';
import { BackgroundState } from './state-types';

export type BackgroundStore = {
	getState(): BackgroundState;
	subscribe(cb: () => void): void;
	dispatch(action: UnknownAction): void;
};

export function createBackgroundStore(): BackgroundStore {
	const store = configureStore({
		reducer: settingsReducer,
		preloadedState: { ready: false },
		middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(effectsMiddleware(rootEffect)),
	});

	store.dispatch(settingsLoad());

	return store as BackgroundStore;
}
