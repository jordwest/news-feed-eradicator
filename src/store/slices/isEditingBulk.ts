
import { createSlice } from '@reduxjs/toolkit';

const isEditingBulkSlice = createSlice({
	name: 'isEditingBulk',
	initialState: false,
	reducers: {
		toggleBulkEdit: (state) => !state,
	},
});

export const { toggleBulkEdit } = isEditingBulkSlice.actions;
export default isEditingBulkSlice.reducer;