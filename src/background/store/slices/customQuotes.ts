
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CustomQuote } from '../../../quote';

const customQuotesSlice = createSlice({
	name: 'customQuotes',
	initialState: [] as CustomQuote[],
	reducers: {
		addCustomQuote: (state, action: PayloadAction<CustomQuote>) => state.concat([action.payload]),
		removeCustomQuote: (state, action: PayloadAction<string>) => state.filter((quote) => quote.id !== action.payload),
	},
});

export const {
	addCustomQuote,
	removeCustomQuote,
} = customQuotesSlice.actions;

export default customQuotesSlice.reducer;