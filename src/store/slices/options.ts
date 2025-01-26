import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SiteId } from '../../sites';

export type OptionsState = {
  confirmDisableSite: SiteId | null;
  tab: 'sites' | 'quotes' | 'about';
  quotesTab: 'custom' | 'builtin';
};

const initialState: OptionsState = {
  confirmDisableSite: null,
  tab: 'sites',
  quotesTab: 'custom',
};

export type SiteDisabledConfirmed = {
  site: SiteId;
  until: { t: 'forever' } | { t: 'temporarily'; milliseconds: number };
};

const optionsSlice = createSlice({
  name: 'options',
  initialState,
  reducers: {
    uiSitesSiteDisableConfirmShow(state, action: PayloadAction<SiteId>) {
      state.confirmDisableSite = state.confirmDisableSite === action.payload ? null : action.payload;
    },
    uiSitesSiteDisableConfirmed(state, action: PayloadAction<SiteDisabledConfirmed>) {
      state.confirmDisableSite = null;
    },
    uiOptionsTabShow(state, action: PayloadAction<OptionsState['tab']>) {
      state.tab = action.payload;
    },
    uiOptionsQuoteTabShow(state, action: PayloadAction<OptionsState['quotesTab']>) {
      state.quotesTab = action.payload;
    },
    uiOptionsBackgroundSettingsChanged(state, action: PayloadAction<{ builtinQuotesEnabled: boolean }>) {
      if (!action.payload.builtinQuotesEnabled && state.quotesTab === 'builtin') {
        state.quotesTab = 'custom';
      }
    },
    uiOptionsShow: () => {},
    uiSitesSiteClick(state, action: PayloadAction<{ site: SiteId }>) {}
  },
});

export const {
  uiSitesSiteDisableConfirmShow,
  uiSitesSiteDisableConfirmed,
  uiOptionsTabShow,
  uiOptionsQuoteTabShow,
  uiOptionsBackgroundSettingsChanged,
  uiOptionsShow,
  uiSitesSiteClick,
} = optionsSlice.actions;

export default optionsSlice.reducer;
