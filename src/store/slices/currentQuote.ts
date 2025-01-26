import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the type for CurrentQuote inline if it's not used elsewhere
export type CurrentQuote = { type: 'custom'; id: string } | { type: 'builtin'; id: number } | { type: 'none-found' };

const currentQuoteSlice = createSlice({
  name: 'currentQuote',
  initialState: null as CurrentQuote | null,
  reducers: {
    setCurrentQuote: (_, action: PayloadAction<CurrentQuote>) => action.payload,
    quoteSaveClicked: () => {},
    quoteRemoveCurrent: () => {},
  },
});

export const { quoteSaveClicked, setCurrentQuote, quoteRemoveCurrent } = currentQuoteSlice.actions;
export default currentQuoteSlice.reducer;
