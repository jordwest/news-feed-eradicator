import { combineReducers } from 'redux';
import { SettingsActionObject, SettingsActionType } from '../action-types';
import { SiteId } from '../../../sites';

export enum SiteState {
	ENABLED,
	PARTIALLY_ENABLED,
	DISABLED,
}

const sitesEnabled = (
	state: Record<SiteId, SiteState> | undefined,
	action: SettingsActionObject
): Record<SiteId, SiteState> | null => {
	if (action.type === SettingsActionType.SITES_ENABLED_UPDATE) {
		return action.sitesEnabled;
	}
	return state || null;
};

export type SitesState = {
	sitesEnabled: Record<SiteId, SiteState> | null;
};

export const sitesReducer = combineReducers({
	sitesEnabled,
});
