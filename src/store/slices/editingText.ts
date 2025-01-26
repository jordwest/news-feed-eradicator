
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const editingTextSlice = createSlice({
    name: 'editingText',
    initialState: '',
    reducers: {
        startEditText: () => '',
        cancelEditText: () => '',
        setQuoteText: (_, action: PayloadAction<string>) => action.payload,
        toggleBulkText: () => '',
    },
});

export const {
    startEditText,
    cancelEditText,
    setQuoteText,
    toggleBulkText
} = editingTextSlice.actions;
export default editingTextSlice.reducer;
