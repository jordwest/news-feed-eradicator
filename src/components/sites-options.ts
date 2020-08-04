import { Store } from '../store';
import { h } from 'snabbdom';
import { Sites, SiteId } from '../sites';
import { SiteState } from '../store/sites/reducer';
import { ActionType } from '../store/action-types';

export const SitesOptions = (store: Store) => {
	const state = store.getState();
	if (state.sites.sitesEnabled == null) return null;

	const stateIcon = (state: SiteState) => {
		switch (state) {
			case SiteState.ENABLED:
				return '✅';
			case SiteState.PARTIALLY_ENABLED:
				return '⚠️';
			case SiteState.DISABLED:
				return '🔘';
		}
	};
	const Site = (id: SiteId, label: string) => {
		const enabled = state.sites.sitesEnabled![id];
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
		return h(
			'button',
			{ on: { click: onClick } },
			stateIcon(state.sites.sitesEnabled![id]) + ' ' + label
		);
	};

	return h('div.v-stack-2', [
		h('h2', 'Sites'),
		h(
			'div.v-stack',
			Object.keys(Sites).map((id: SiteId) => Site(id, Sites[id].label))
		),
	]);
};
