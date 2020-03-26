/**
 * See the WebExtension API:
 * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API
 */
type WebExtensionAPI = {
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
	storage: {
		sync: {
			get(keys: string | string[] | null, callback: (data: any) => void): void;
			set(keys: object): void;
		};
	};
};

declare var browser: WebExtensionAPI | undefined;
declare var chrome: ChromeWebExtensionAPI | undefined;

export function loadSettings(callback) {
	if (browser) {
		browser.storage.sync
			.get(null)
			.then(data => {
				callback(data);
			})
			.catch(e => console.error(e));
	} else if (chrome) {
		chrome.storage.sync.get(null, data => {
			callback(data);
		});
	}
}

export function saveSettings(data) {
	chrome.storage.sync.set(data);
}
