
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Permissions } from '../../../webextension';

const permissionsSlice = createSlice({
	name: 'permissions',
	initialState: { permissions: [], origins: [] } as Permissions,
	reducers: {
		updatePermissions: (state, action: PayloadAction<Permissions>) => action.payload,
		checkPermissions: () => {},
	},
});

export const {
	updatePermissions,
	checkPermissions
} = permissionsSlice.actions;

export default permissionsSlice.reducer;