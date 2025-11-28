
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SiteId } from '../../../sites';
import { Settings } from '../index';

const sitesSlice = createSlice({
	name: 'sites',
	initialState: Settings.defaultSites() as Record<SiteId, Settings.SiteState>,
	reducers: {
		setSiteState: (state, action: PayloadAction<{ siteId: SiteId; state: Settings.SiteState }>) => {
			state[action.payload.siteId] = action.payload.state;
		},
	},
});

export const {
	setSiteState,
} = sitesSlice.actions;

export default sitesSlice.reducer;
