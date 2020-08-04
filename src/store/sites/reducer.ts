import { combineReducers } from 'redux';
import { ActionObject, ActionType } from '../action-types';
import { SiteId } from '../../sites';

export enum SiteState {
	ENABLED,
	PARTIALLY_ENABLED,
	DISABLED,
}

const sitesEnabled = (
	state: Record<SiteId, SiteState> | undefined,
	action: ActionObject
): Record<SiteId, SiteState> | null => {
	if (action.type === ActionType.UI_SITES_ENABLED_UPDATE) {
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
