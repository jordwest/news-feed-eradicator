import { configureStore, UnknownAction } from '@reduxjs/toolkit';

import { effectsMiddleware } from '../lib/redux-effects';
import { rootEffect } from './effects';
import { 
	currentQuoteReducer,
	editingSourceReducer,
	editingTextReducer,
	isQuoteMenuVisibleReducer,
	isEditingQuoteReducer,
	isEditingBulkReducer,
	errorReducer,
	settingsReducer,
	optionsReducer,
	CurrentQuote,
	OptionsState,
} from './slices';
import { SettingsState } from '../background/store/state-types';

export type Store = {
	getState(): IState;
	subscribe(cb: () => void): void;
	dispatch(action: UnknownAction): void;
};

export interface IState {
	currentQuote: CurrentQuote | null;
	editingSource: string;
	editingText: string;
	isQuoteMenuVisible: boolean;
	isEditingQuote: boolean;
	isEditingBulk: boolean;
	error: string;
	settings: SettingsState | null;
	uiOptions: OptionsState;
}


export function createStore(): Store {
	const store: Store = configureStore({
		reducer: {
			currentQuote: currentQuoteReducer,
			editingSource: editingSourceReducer,
			editingText: editingTextReducer,
			isQuoteMenuVisible: isQuoteMenuVisibleReducer,
			isEditingQuote: isEditingQuoteReducer,
			isEditingBulk: isEditingBulkReducer,
			error: errorReducer,
			settings: settingsReducer,
			uiOptions: optionsReducer,
		},
		middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(effectsMiddleware(rootEffect)),
	});

	return store;
}