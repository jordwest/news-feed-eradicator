import { BackgroundEffect } from '../effects';
import { Effect } from '../../../lib/redux-effects';
import { BackgroundActionType } from '../action-types';
import { getBrowser } from '../../../webextension';
import { Sites, SiteId } from '../../../sites';
import { SiteState } from './reducer';

export const getPermissions = async () => {
	const permissions = await getBrowser().permissions.getAll();

	let states: Record<SiteId, SiteState> = {} as Record<SiteId, SiteState>;
	Object.keys(Sites).forEach((key: SiteId) => {
		const site = Sites[key];
		const grantedOrigins = site.origins.filter(
			(origin) => permissions.origins.indexOf(origin) !== -1
		);
		let permState = SiteState.DISABLED;
		console.log('granted', grantedOrigins, 'origins', site.origins);
		if (grantedOrigins.length === site.origins.length) {
			permState = SiteState.ENABLED;
		} else if (grantedOrigins.length > 0) {
			permState = SiteState.PARTIALLY_ENABLED;
		}
		states[key] = permState;
	});
	return states;
};

const checkPermissions: BackgroundEffect = (store) => async (action) => {
	if (action.type === BackgroundActionType.SITES_ENABLED_CHECK) {
		const states = await getPermissions();
		store.dispatch({
			type: BackgroundActionType.SITES_ENABLED_UPDATE,
			sitesEnabled: states,
		});
	}
};

export const sitesEffect: BackgroundEffect = Effect.all(checkPermissions);
