
import { createSlice } from '@reduxjs/toolkit';

const backgroundActionSlice = createSlice({
	name: 'isEditingQuote',
	initialState: false,
	reducers: {
		backgroundAction: (_, action) => {},
	},
});

export const { backgroundAction } = backgroundActionSlice.actions;
