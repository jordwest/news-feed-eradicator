
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const newQuoteSlice = createSlice({
	name: 'newQuote',
	initialState: false,
	reducers: {
		selectNewQuote: () => {},
		addQuotesBulk: (_, action: PayloadAction<{text: string}>) => {},
	},
});

export const { selectNewQuote, addQuotesBulk } = newQuoteSlice.actions;
