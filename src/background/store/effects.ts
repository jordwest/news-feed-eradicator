import { Effect } from '../../lib/redux-effects';
import { BackgroundState, SettingsState } from './reducer';
import { BackgroundActionObject, BackgroundActionType } from './action-types';
import { getBrowser, Port } from '../../webextension';
import { Message, MessageType } from '../../messaging/types';
import { Settings } from './index';
import config from '../../config';
import { getPermissions, sitesEffect } from './sites/effects';
import { getSettingsHealth } from './sites/selectors';
import { SiteId, Sites } from '../../sites';
import SiteStateTag = Settings.SiteStateTag;

export type BackgroundEffect = Effect<BackgroundState, BackgroundActionObject>;

const getSettings = (state: SettingsState): Settings.T => {
	return {
		version: 1,
		showQuotes: state.showQuotes,
		builtinQuotesEnabled: state.builtinQuotesEnabled,
		featureIncrement: state.featureIncrement,
		hiddenBuiltinQuotes: state.hiddenBuiltinQuotes,
		customQuotes: state.customQuotes,
		sites: state.sites,
	};
};

/**
 * Listen for content scripts
 */
const listen: BackgroundEffect = (store) => {
	const browser = getBrowser();
	let pages: Port[] = [];
	browser.runtime.onConnect.addListener((port) => {
		pages.push(port);

		const state = store.getState();
		// Send the new client the latest settings
		if (state.ready === true) {
			const settings: SettingsState = state.settings;
			port.postMessage({ t: MessageType.SETTINGS_CHANGED, settings });
		}

		// Remove the port when it closes
		port.onDisconnect.addListener(
			() => (pages = pages.filter((p) => p !== port))
		);
		port.onMessage.addListener((msg: Message) => {
			if (msg.t === MessageType.SETTINGS_ACTION) {
				store.dispatch(msg.action);
			}
			if (msg.t === MessageType.OPTIONS_PAGE_OPEN) {
				browser.runtime.openOptionsPage().catch((e) => console.error(e));
			}
		});
	});

	// Then, after every store action we save the settings and
	// let all the clients know the new settings
	return () => {
		const state = store.getState();
		// Send the new client the latest settings
		if (state.ready === true) {
			const settings: SettingsState = state.settings;
			Settings.save(getSettings(state.settings));
			pages.forEach((port) =>
				port.postMessage({ t: MessageType.SETTINGS_CHANGED, settings })
			);
		}
	};
};

export function areNewFeaturesAvailable(state: SettingsState) {
	return config.newFeatureIncrement > state.featureIncrement;
}

const loadSettings: BackgroundEffect = (store) => async (action) => {
	if (action.type === BackgroundActionType.SETTINGS_LOAD) {
		const [settings, permissions] = await Promise.all([
			Settings.load(),
			getPermissions(),
		]);

		const sites: Record<SiteId, Settings.SiteState> = {} as Record<
			SiteId,
			Settings.SiteState
		>;
		// For any sites that don't yet exist in the settings,
		// add a note to look at the permissions as the source of
		// truth instead
		for (const key of Object.keys(Sites)) {
			sites[key] =
				settings.sites[key] != null
					? settings.sites[key]
					: { type: Settings.SiteStateTag.CHECK_PERMISSIONS };
		}

		const state: SettingsState = {
			showQuotes: settings.showQuotes,
			builtinQuotesEnabled: settings.builtinQuotesEnabled,
			featureIncrement: settings.featureIncrement,
			hiddenBuiltinQuotes: settings.hiddenBuiltinQuotes,
			customQuotes: settings.customQuotes,
			sites,
			permissions,
		};

		store.dispatch({
			type: BackgroundActionType.SETTINGS_LOADED,
			settings: state,
		});
		const newFeaturesAvailable = areNewFeaturesAvailable(state);
		const settingsHealth = getSettingsHealth(state);

		// Show the options page at startup if something needs addressing
		if (
			settingsHealth.noSitesEnabled ||
			settingsHealth.sitesNeedingPermissions >= 1 ||
			newFeaturesAvailable
		) {
			getBrowser().runtime.openOptionsPage();
		}

		store.dispatch({ type: BackgroundActionType.CONTENT_SCRIPTS_REGISTER });
	}
};

export const registerContentScripts: BackgroundEffect =
	(store) => async (action) => {
		if (action.type === BackgroundActionType.CONTENT_SCRIPTS_REGISTER) {
			const browser = getBrowser();
			await browser.scripting.unregisterContentScripts();

			const state = store.getState();
			if (state.ready === false) {
				return;
			}

			const siteIds = Object.keys(state.settings.sites) as SiteId[];
			const siteMatches = siteIds.flatMap((siteId) => Sites[siteId].origins);

			await browser.scripting.registerContentScripts([
				{
					id: 'intercept',
					js: ['intercept.js'],
					css: ['eradicate.css'],
					matches: siteMatches,
					runAt: 'document_start',
				},
			]);
		}
	};

export const logAction: BackgroundEffect = (store) => async (action) => {
	console.info(action);
};

export const rootEffect = Effect.all(
	listen,
	loadSettings,
	sitesEffect,
	registerContentScripts,
	logAction
);
