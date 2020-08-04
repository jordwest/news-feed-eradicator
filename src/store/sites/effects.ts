import { AppEffect } from '../effects';
import { Effect } from '../../lib/redux-effects';
import { ActionType } from '../action-types';
import { getBrowser } from '../../webextension';
import { Sites, SiteId } from '../../sites';
import { SiteState } from './reducer';

const checkPermissions: AppEffect = (store) => async (action) => {
	if (action.type === ActionType.UI_SITES_ENABLED_CHECK) {
		const permissions = await getBrowser().permissions.getAll();
		console.log('reported permissions', permissions);

		let states: Record<SiteId, SiteState> = {} as Record<SiteId, SiteState>;
		Object.keys(Sites).forEach((key: SiteId) => {
			const site = Sites[key];
			const grantedOrigins = site.origins.filter(
				(origin) => permissions.origins.indexOf(origin) !== -1
			);
			let permState = SiteState.DISABLED;
			if (grantedOrigins.length === site.origins.length) {
				permState = SiteState.ENABLED;
			} else if (grantedOrigins.length > 0) {
				permState = SiteState.PARTIALLY_ENABLED;
			}
			states[key] = permState;
		});

		store.dispatch({
			type: ActionType.UI_SITES_ENABLED_UPDATE,
			sitesEnabled: states,
		});
	}
};

const requestPermissions: AppEffect = (store) => async (action) => {
	if (action.type === ActionType.UI_SITES_ENABLED_REQUEST_PERMISSIONS) {
		const site = Sites[action.site];
		const success = await getBrowser().permissions.request({
			permissions: [],
			origins: site.origins,
		});
		if (success) {
			// Check and update permissions
			store.dispatch({ type: ActionType.UI_SITES_ENABLED_CHECK });
		}
	}
};

const removePermissions: AppEffect = (store) => async (action) => {
	if (action.type === ActionType.UI_SITES_ENABLED_REMOVE_PERMISSIONS) {
		const site = Sites[action.site];
		const success = await getBrowser().permissions.remove({
			permissions: [],
			origins: site.origins,
		});
		if (success) {
			// Check and update permissions
			store.dispatch({ type: ActionType.UI_SITES_ENABLED_CHECK });
		}
	}
};

export const sitesEffect: AppEffect = Effect.all(
	checkPermissions,
	requestPermissions,
	removePermissions
);
