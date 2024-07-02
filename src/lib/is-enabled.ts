import { Sites, Site } from '../sites';
import { SettingsState } from '../background/store/reducer';
import {
	getSiteStatus,
	SiteStatusTag,
	SiteStatus,
} from '../background/store/sites/selectors';

function pathMatches(path: string, patterns: string[]): boolean {
  return patterns.some(pattern => {
      // Convert wildcard patterns to regex to accomodate for wildcards in YouTube Shorts
      const regexPattern = new RegExp(`^${pattern.replace(/\*/g, '.*')}$`);
      return regexPattern.test(path);
  });
}

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
		if (site.domain.find(domain => window.location.host.includes(domain)) != null) {
			// Always disabled if the path doesn't match
			if (site.paths.indexOf(window.location.pathname) === -1) {
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
