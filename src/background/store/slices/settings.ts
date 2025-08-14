import { createSlice, PayloadAction, UnknownAction, combineReducers } from '@reduxjs/toolkit';

import showQuotesReducer from './showQuotes';
import builtinQuotesEnabledReducer from './builtinQuotesEnabled';
import featureIncrementReducer from './featureIncrement';
import hiddenBuiltinQuotesReducer from './hiddenBuiltinQuotes';
import customQuotesReducer from './customQuotes';
import permissionsReducer from './permissions';
import sitesReducer from './sites';
import { BackgroundState, SettingsState } from '../state-types';

const settingsReducer = combineReducers({
	showQuotes: showQuotesReducer,
	builtinQuotesEnabled: builtinQuotesEnabledReducer,
	featureIncrement: featureIncrementReducer,
	hiddenBuiltinQuotes: hiddenBuiltinQuotesReducer,
	customQuotes: customQuotesReducer,
	permissions: permissionsReducer,
	sites: sitesReducer,
});

const settingsSlice = createSlice({
	name: 'background',
	initialState: { ready: false } as BackgroundState,
	reducers: {
	  settingsLoaded: (_, action: PayloadAction<SettingsState>) => {
		return {
		  ready: true,
		  settings: action.payload,
		};
	  },
	  settingsLoad: () => {},
	},
	extraReducers: (builder) => {
	  builder.addDefaultCase((state: BackgroundState, action: UnknownAction) => {
		if (state === null || state.ready === false) {
			return { ready: false };
		} else if (state.ready === true) {
		  return {
			ready: true,
			settings: settingsReducer(state.settings, action),
		  };
		}
		return state;
	  });
	},
});

export const { settingsLoaded, settingsLoad } = settingsSlice.actions;

export default settingsSlice.reducer;