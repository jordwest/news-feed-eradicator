
import { createSlice } from '@reduxjs/toolkit';

const showQuotesSlice = createSlice({
	name: 'showQuotes',
	initialState: true,
	reducers: {
		toggleShowQuotes: (state) => !state,
	},
});

export const {
	toggleShowQuotes,
} = showQuotesSlice.actions;

export default showQuotesSlice.reducer;