
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const errorSlice = createSlice({
    name: 'error',
    initialState: '',
    reducers: {
        cancelEditError: () => '',
        parseError: (_, action: PayloadAction<string>) => action.payload,
    },
});

export const {
    cancelEditError,
    parseError
} = errorSlice.actions;
export default errorSlice.reducer;
