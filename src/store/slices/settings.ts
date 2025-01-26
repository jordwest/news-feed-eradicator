
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SettingsState } from '../../background/store/state-types';

const settingsSlice = createSlice({
	name: 'settings',
	initialState: null as SettingsState | null,
	reducers: {
		backgroundSettingsChanged: (_, action: PayloadAction<SettingsState>) => action.payload,
	},
});

export const { backgroundSettingsChanged } = settingsSlice.actions;
export default settingsSlice.reducer;
