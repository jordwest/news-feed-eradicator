import { Effect } from '../lib/redux-effects';
import { SettingsRoot, SettingsState } from './reducer';
import { SettingsActionObject, SettingsActionType } from './action-types';
import { getBrowser, Port } from '../webextension';
import { Message, MessageType } from '../messaging/types';
import { Settings } from '../settings';
import config from '../config';

type SettingsEffect = Effect<SettingsRoot, SettingsActionObject>;

const getSettings = (state: SettingsRoot): Settings.T | undefined => {
	if (!state.ready) return undefined;
	return {
		version: 1,
		showQuotes: state.settings.showQuotes,
		builtinQuotesEnabled: state.settings.builtinQuotesEnabled,
		featureIncrement: state.settings.featureIncrement,
		hiddenBuiltinQuotes: state.settings.hiddenBuiltinQuotes,
		customQuotes: state.settings.customQuotes,
	};
};

/**
 * Listen for content scripts
 */
const listen: SettingsEffect = (store) => {
	const browser = getBrowser();
	let pages: Port[] = [];
	browser.runtime.onConnect.addListener((port) => {
		pages.push(port);

		// Send the new client the latest settings
		const settings: Settings.T | undefined = getSettings(store.getState());
		if (settings != null) {
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
				browser.runtime.openOptionsPage();
			}
		});
	});

	// Then, after every store action we save the settings and
	// let all the clients know the new settings
	return () => {
		const settings: Settings.T | undefined = getSettings(store.getState());
		if (settings != null) {
			Settings.save(settings);
			pages.forEach((port) =>
				port.postMessage({ t: MessageType.SETTINGS_CHANGED, settings })
			);
		}
	};
};

export function areNewFeaturesAvailable(state: SettingsState) {
	return config.newFeatureIncrement > state.featureIncrement;
}

const loadSettings: SettingsEffect = (store) => (action) => {
	if (action.type === SettingsActionType.SETTINGS_LOAD) {
		Settings.load().then((settings) => {
			store.dispatch({ type: SettingsActionType.SETTINGS_LOADED, settings });

			// Show the options page if there are new features
			// (disabled for now)
			//if (areNewFeaturesAvailable(settings)) {
			//	getBrowser().runtime.openOptionsPage();
			//}
		});
	}
};

export const rootEffect = Effect.all(listen, loadSettings);
