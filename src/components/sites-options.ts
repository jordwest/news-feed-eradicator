import { Store } from '../store';
import { h } from 'snabbdom';
import { Sites, SiteId } from '../sites';
import { SiteState } from '../background/store/sites/reducer';
import { ActionType } from '../store/action-types';
import { getSettingsHealth } from '../background/store/sites/selectors';
import { WarningAlert } from './alert';
import { VNode } from 'snabbdom/vnode';

export const SitesOptions = (store: Store) => {
	const state = store.getState();
	if (state.settings == null) return null;

	const stateText = (state: SiteState) => {
		switch (state) {
			case SiteState.ENABLED:
				return h('div.pad-1.text-right.text-muted', 'Enabled');
			case SiteState.PARTIALLY_ENABLED:
				return h('div.pad-1.text-right', '⚠️  Needs permissions');
			case SiteState.DISABLED:
				return h('div.pad-1.text-right.text-muted', 'Disabled');
		}
	};
	const stateColor = (state: SiteState) => {
		switch (state) {
			case SiteState.ENABLED:
				return '.col-bg-active.strong';
			case SiteState.PARTIALLY_ENABLED:
				return '.col-bg-warn';
			case SiteState.DISABLED:
				return '.bg-3-hover';
		}
	};
	const Site = (id: SiteId, label: string) => {
		const enabled = state.settings!.sites.sitesEnabled![id];
		const onClick = () => {
			const action =
				enabled === SiteState.ENABLED
					? ActionType.UI_SITES_ENABLED_REMOVE_PERMISSIONS
					: ActionType.UI_SITES_ENABLED_REQUEST_PERMISSIONS;

			store.dispatch({
				type: action,
				site: id,
			});
		};

		const siteState = state.settings!.sites.sitesEnabled![id];
		const bgColor = stateColor(siteState);
		return h(
			'button.pad-0.site-grid.border.width-100pc.underline-off' + bgColor,
			{ on: { click: onClick } },
			[h('div.pad-1', label), stateText(siteState)]
		);
	};

	const health = getSettingsHealth(state.settings);
	let alerts: VNode[] = [];
	if (health.noSitesEnabled) {
		alerts.push(
			WarningAlert(
				`News Feed Eradicator isn't currently enabled for any sites. Choose at least one below to get started.`
			)
		);
	}
	if (health.sitesNeedingPermissions > 0) {
		alerts.push(
			WarningAlert(
				`Some of the sites you've enabled require new permissions to keep working. Click the highlighted sites to approve these permissions.`
			)
		);
	}

	return h('div.v-stack-2', [
		h('h2', 'Sites'),
		...alerts,
		h(
			'p',
			"Choose sites below to enable News Feed Eradicator. When you enable a site, we'll request your permission to modify that site."
		),
		h(
			'div.v-stack',
			Object.keys(Sites).map((id: SiteId) => Site(id, Sites[id].label))
		),
	]);
};
