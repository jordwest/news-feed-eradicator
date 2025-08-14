
import { createSlice } from '@reduxjs/toolkit';

const builtinQuotesEnabledSlice = createSlice({
	name: 'builtinQuotesEnabled',
	initialState: true,
	reducers: {
		toggleBuiltinQuotesEnabled: (state) => !state,
	},
});

export const {
	toggleBuiltinQuotesEnabled
} = builtinQuotesEnabledSlice.actions;

export default builtinQuotesEnabledSlice.reducer;