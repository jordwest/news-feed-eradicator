/**
 * See the WebExtension API:
 * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API
 */
type WebExtensionAPI = {
	runtime: {
		openOptionsPage: () => Promise<void>;
		sendMessage: (message: any) => Promise<void>;
		onMessage: {
			addListener: (callback: (data: any) => void | Promise<void>) => void;
		};
	};
	storage: {
		sync: {
			get(keys: string | string[] | null): Promise<any>;
			set(keys: object): void;
		};
	};
};

/**
 * Chrome doesn't exactly match the WebExtension API, see full list of incompatibilities here:
 *
 * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Chrome_incompatibilities
 */
type ChromeWebExtensionAPI = {
	runtime: {
		openOptionsPage: (cb: () => void) => void;
		sendMessage: (
			extId: string | undefined,
			message: any,
			options: undefined,
			responseCallback: (res: any) => void
		) => void;
		onMessage: {
			addListener: (callback: (data: any) => void) => void;
		};
	};
	storage: {
		sync: {
			get(keys: string | string[] | null, callback: (data: any) => void): void;
			set(keys: object): void;
		};
	};
};

declare var browser: WebExtensionAPI | undefined;
declare var chrome: ChromeWebExtensionAPI | undefined;

export function getBrowser(): WebExtensionAPI {
	if (typeof browser !== 'undefined') {
		return browser;
	} else if (typeof chrome !== 'undefined') {
		return {
			runtime: {
				openOptionsPage: () =>
					new Promise(resolve => chrome.runtime.openOptionsPage(resolve)),
				sendMessage: m =>
					new Promise(resolve =>
						chrome.runtime.sendMessage(undefined, m, undefined, resolve)
					),

				onMessage: {
					addListener: cb => chrome.runtime.onMessage.addListener(cb),
				},
			},
			storage: {
				sync: {
					get: (key: string | string[]) =>
						new Promise(resolve => {
							chrome.storage.sync.get(key, resolve);
						}),
					set: chrome.storage.sync.set,
				},
			},
		};
	} else {
		throw new Error('Could not find WebExtension API');
	}
}

export function loadSettings(callback: (data: any) => void) {
	if (typeof browser !== 'undefined') {
		browser.storage.sync
			.get(null)
			.then(data => {
				callback(data);
			})
			.catch(e => console.error(e));
	} else if (typeof chrome !== 'undefined') {
		chrome.storage.sync.get(null, data => {
			callback(data);
		});
	} else {
		throw new Error('Could not find WebExtension API');
	}
}

export function saveSettings(data: any) {
	chrome.storage.sync.set(data);
}
