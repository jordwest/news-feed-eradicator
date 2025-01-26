
import { createSlice } from '@reduxjs/toolkit';

const isEditingQuoteSlice = createSlice({
	name: 'isEditingQuote',
	initialState: false,
	reducers: {
		startEditQuote: () => true,
		cancelEditQuote: () => false,
	},
});

export const { startEditQuote, cancelEditQuote } = isEditingQuoteSlice.actions;
export default isEditingQuoteSlice.reducer;
