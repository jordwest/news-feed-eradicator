import { SettingsState } from '../reducer';
import { SiteState } from './reducer';

type SettingsHealth = {
	noSitesEnabled: boolean;
	sitesNeedingPermissions: number;
};

export function getSettingsHealth(state: SettingsState): SettingsHealth {
	let atLeastOneSiteEnabled = false;
	let sitesNeedingPermissions = 0;
	Object.keys(state.sites.sitesEnabled!).forEach((id) => {
		const status = state.sites.sitesEnabled![id];

		console.log('site', id, 'is', status);
		if (
			status === SiteState.PARTIALLY_ENABLED ||
			status === SiteState.ENABLED
		) {
			atLeastOneSiteEnabled = true;
		}
		if (status === SiteState.PARTIALLY_ENABLED) {
			sitesNeedingPermissions += 1;
		}
	});

	return {
		noSitesEnabled: !atLeastOneSiteEnabled,
		sitesNeedingPermissions,
	};
}
