import { Effect } from '../../lib/redux-effects';
import { BackgroundState, SettingsState } from './reducer';
import { BackgroundActionObject, BackgroundActionType } from './action-types';
import { getBrowser, Port } from '../../webextension';
import { Message, MessageType } from '../../messaging/types';
import { Settings } from './index';
import config from '../../config';
import { sitesEffect, getPermissions } from './sites/effects';
import { getSettingsHealth } from './sites/selectors';

export type BackgroundEffect = Effect<BackgroundState, BackgroundActionObject>;

const getSettings = (state: SettingsState): Settings.T => {
	return {
		version: 1,
		showQuotes: state.showQuotes,
		builtinQuotesEnabled: state.builtinQuotesEnabled,
		featureIncrement: state.featureIncrement,
		hiddenBuiltinQuotes: state.hiddenBuiltinQuotes,
		customQuotes: state.customQuotes,
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
		const [settings, sites] = await Promise.all([
			Settings.load(),
			getPermissions(),
		]);

		const state: SettingsState = {
			showQuotes: settings.showQuotes,
			builtinQuotesEnabled: settings.builtinQuotesEnabled,
			featureIncrement: settings.featureIncrement,
			hiddenBuiltinQuotes: settings.hiddenBuiltinQuotes,
			customQuotes: settings.customQuotes,
			sites: {
				sitesEnabled: sites,
			},
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
	}
};

export const rootEffect = Effect.all(listen, loadSettings, sitesEffect);
