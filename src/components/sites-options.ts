import { Store } from '../store';
import { h } from 'snabbdom';
import { Sites, SiteId } from '../sites';
import {
	getSettingsHealth,
	SiteStatus,
	getSiteStatus,
	SiteStatusTag,
} from '../background/store/sites/selectors';
import { ActionType } from '../store/action-types';
import { WarningAlert } from './alert';
import { VNode } from 'snabbdom/vnode';
import { MINUTE, HOUR, DAY, readableDuration } from '../lib/time';

const DisableConfirmation = (store: Store, siteId: SiteId) => {
	const button = (
		label: string,
		until: { t: 'forever' } | { t: 'temporarily'; milliseconds: number }
	) =>
		h(
			'button',
			{
				on: {
					click: () =>
						store.dispatch({
							type: ActionType.UI_SITES_SITE_DISABLE_CONFIRMED,
							site: siteId,
							until,
						}),
				},
			},
			label
		);

	return h('div.bg-active-light.pad-1.h-stack', [
		h('strong', `Show feed for`),
		button('5 min', { t: 'temporarily', milliseconds: 5 * MINUTE }),
		button('10 min', { t: 'temporarily', milliseconds: 10 * MINUTE }),
		button('30 min', { t: 'temporarily', milliseconds: 30 * MINUTE }),
		button('1 hr', { t: 'temporarily', milliseconds: HOUR }),
		button('1 day', { t: 'temporarily', milliseconds: DAY }),
		button('forever', { t: 'forever' }),
	]);
};

export const SitesOptions = (store: Store) => {
	const state = store.getState();
	if (state.settings == null) return null;

	const stateText = (state: SiteStatus) => {
		switch (state.type) {
			case SiteStatusTag.ENABLED:
				return h(
					'div.pad-1.flex.align-items-center.justify-right.text-right.text-muted',
					'Eradicating'
				);
			case SiteStatusTag.NEEDS_NEW_PERMISSIONS:
				return h(
					'div.pad-1.flex.align-items-center.justify-right.text-right',
					'⚠️  Needs permissions'
				);
			case SiteStatusTag.DISABLED:
				return h(
					'div.pad-1.flex.align-items-center.justify-right.text-right.text-muted',
					'Off'
				);
			case SiteStatusTag.DISABLED_TEMPORARILY:
				return h(
					'div.pad-1.flex.align-items-center.justify-right.text-right.text-muted',
					'Off for ' + readableDuration(state.until - Date.now())
				);
		}
	};
	const stateColor = (state: SiteStatus) => {
		switch (state.type) {
			case SiteStatusTag.ENABLED:
				return '.bg-active.strong';
			case SiteStatusTag.NEEDS_NEW_PERMISSIONS:
				return '.col-bg-warn';
			case SiteStatusTag.DISABLED:
			case SiteStatusTag.DISABLED_TEMPORARILY:
				return '.bg-active-light-hover';
		}
	};
	const stateIcon = (state: SiteStatus) => {
		switch (state.type) {
			case SiteStatusTag.ENABLED:
			case SiteStatusTag.NEEDS_NEW_PERMISSIONS:
				return h('img', { attrs: { src: './icons/checked.svg' } });
			case SiteStatusTag.DISABLED:
			case SiteStatusTag.DISABLED_TEMPORARILY:
				return h('img', { attrs: { src: './icons/unchecked.svg' } });
		}
	};
	const sites = getSiteStatus(state.settings);
	const Site = (id: SiteId, label: string) => {
		const siteStatus = sites[id];

		const onClick = () => {
			store.dispatch({
				type: ActionType.UI_SITES_SITE_CLICK,
				site: id,
			});
		};

		const bgColor = stateColor(siteStatus);
		let showDisableConfirm = state.uiOptions.confirmDisableSite === id;
		return h('div', [
			h(
				'button.pad-0.site-grid.border.width-100pc.underline-off' + bgColor,
				{ on: { click: onClick } },
				[
					h('div.pad-1.flex.h-stack.align-items-center', [
						h('div', stateIcon(siteStatus)),
						h('div', label),
					]),
					stateText(siteStatus),
				]
			),
			showDisableConfirm ? DisableConfirmation(store, id) : null,
		]);
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
