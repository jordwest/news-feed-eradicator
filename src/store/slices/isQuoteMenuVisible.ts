
import { createSlice } from '@reduxjs/toolkit';

const isQuoteMenuVisibleSlice = createSlice({
	name: 'isQuoteMenuVisible',
	initialState: false,
	reducers: {
		showMenu: () => true,
		hideMenu: () => false,
		toggleMenu: (state) => !state,
	},
});

export const { showMenu, hideMenu, toggleMenu } = isQuoteMenuVisibleSlice.actions;
export default isQuoteMenuVisibleSlice.reducer;