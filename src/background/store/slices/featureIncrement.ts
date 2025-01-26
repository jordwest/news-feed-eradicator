
import { createSlice } from '@reduxjs/toolkit';
import config from '../../../config';

const featureIncrementSlice = createSlice({
	name: 'featureIncrement',
	initialState: 0,
	reducers: {
		incrementFeature: () => config.newFeatureIncrement,
	},
});

export const {
	incrementFeature,
} = featureIncrementSlice.actions;

export default featureIncrementSlice.reducer;