import { Sites, Site } from '../sites';
import { SettingsState } from '../background/store/reducer';
import { SiteState } from '../background/store/sites/reducer';

export default function isEnabled(state: SettingsState): boolean {
	for (let siteId of Object.keys(Sites)) {
		let site: Site = Sites[siteId];
		if (window.location.host.includes(site.domain)) {
			return site.paths.indexOf(window.location.pathname) > -1;
		}
	}

	return false;
}
