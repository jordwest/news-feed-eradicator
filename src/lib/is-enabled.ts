import { Sites, Site } from '../sites';

export default function isEnabled(): boolean {
	for (let siteId of Object.keys(Sites)) {
		let site: Site = Sites[siteId];
		if (window.location.host.includes(site.domain)) {
			return site.paths.indexOf(window.location.pathname) > -1;
		}
	}

	return false;
}
