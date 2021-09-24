import { Sites, Site } from '../sites';
import { SettingsState } from '../background/store/reducer';
import {
	getSiteStatus,
	SiteStatusTag,
	SiteStatus,
} from '../background/store/sites/selectors';

export type EnabledStatus =
	| { type: 'enabled' }
	| { type: 'disabled' }
	| { type: 'disabled-temporarily'; until: number };

export function isEnabled(state: SettingsState): boolean {
	return enabledStatus(state).type === 'enabled';
}

export function enabledStatus(state: SettingsState): EnabledStatus {
	const siteStatuses = getSiteStatus(state);
	for (let siteId of Object.keys(Sites)) {
		let site: Site = Sites[siteId];
		const siteStatus: SiteStatus = siteStatuses[siteId];
		if (window.location.host.includes(site.domain)) {
			// Always disabled if the path doesn't match
			if (!_isPathEnabledForSite(window.location.pathname, site)) {
				return { type: 'disabled' };
			}

			if (siteStatus.type === SiteStatusTag.DISABLED) {
				return { type: 'disabled' };
			} else if (siteStatus.type === SiteStatusTag.DISABLED_TEMPORARILY) {
				return { type: 'disabled-temporarily', until: siteStatus.until };
			}

			return { type: 'enabled' };
		}
	}

	return { type: 'disabled' };
}

function _isPathEnabledForSite(pathname: string, site: Site) {
	if (site.paths.some((p) => p === window.location.pathname)) {
		return true;
	}

	if (site.pathRegExps !== undefined) {
		return site.pathRegExps.some((regExp) => regExp.test(pathname));
	}

	return false;
}
