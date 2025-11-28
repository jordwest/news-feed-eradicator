
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const editingSourceSlice = createSlice({
  name: 'editingSource',
  initialState: '',
  reducers: {
    startEditSource: () => '',
    cancelEditSource: () => '',
    setQuoteSource: (_, action: PayloadAction<string>) => action.payload,
  },
});

export const { startEditSource, cancelEditSource, setQuoteSource } = editingSourceSlice.actions;
export default editingSourceSlice.reducer;
