
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Permissions } from '../../../webextension';

const contentScriptsSlice = createSlice({
	name: 'contentScripts',
	initialState: { },
	reducers: {
		contentScriptsRegister: () => {},
	},
});

export const {
	contentScriptsRegister
} = contentScriptsSlice.actions;