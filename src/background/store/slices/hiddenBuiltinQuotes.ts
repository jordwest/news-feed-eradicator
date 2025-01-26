
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const hiddenBuiltinQuotesSlice = createSlice({
	name: 'hiddenBuiltinQuotes',
	initialState: [] as number[],
	reducers: {
		showHiddenBuiltinQuote: (state, action: PayloadAction<number>) => state.filter((q) => q !== action.payload),
		hideHiddenBuiltinQuote: (state, action: PayloadAction<number>) => state.concat([action.payload]),
		resetHiddenBuiltinQuotes: () => [],
	},
});

export const {
	showHiddenBuiltinQuote,
	hideHiddenBuiltinQuote,
	resetHiddenBuiltinQuotes,
} = hiddenBuiltinQuotesSlice.actions;

export default hiddenBuiltinQuotesSlice.reducer;