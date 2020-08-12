/**
 * See the WebExtension API:
 * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API
 */
type WebExtensionAPI = {
	runtime: {
		openOptionsPage: () => Promise<void>;
		sendMessage: (message: any) => Promise<void>;
		connect: () => Port;
		onConnect: WebExtensionEvent<Port>;
	};
	browserAction: {
		onClicked: WebExtensionEvent<void>;
	};
	permissions: {
		getAll: () => Promise<Permissions>;
		remove: (p: Permissions) => Promise<boolean>;
		request: (p: Permissions) => Promise<boolean>;
	};
	tabs: {
		onUpdated: WebExtensionEvent<TabId>;
		insertCSS: (tabId: TabId, opts: ExecuteOptions) => Promise<any>;
		executeScript: <Returns = void>(
			tabId: TabId,
			opts: ExecuteOptions
		) => Promise<[Returns] | [] | undefined>;
	};
	storage: {
		sync: {
			get(keys: string | string[] | null): Promise<any>;
			set(keys: object): void;
		};
	};
};

export type TabId = number & { __tabId: never };

type ExecuteOptions = {
	file?: string;
	code?: string;
	runAt?: 'document_start' | 'document_end' | 'document_idle';
};

type WebExtensionEvent<Arg> = {
	addListener: (cb: (a: Arg) => void) => void;
};

export type Permissions = {
	permissions: string[];
	origins: string[];
};

export type Port = {
	postMessage(msg: any): void;
	onDisconnect: WebExtensionEvent<Port>;
	onMessage: WebExtensionEvent<any>;
};

/**
 * Chrome doesn't exactly match the WebExtension API, notably using callbacks instead of promises.
 * See full list of incompatibilities here:
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
		connect: () => Port;
		onConnect: WebExtensionEvent<Port>;
	};
	browserAction: {
		onClicked: WebExtensionEvent<void>;
	};
	permissions: {
		getAll: (cb: (p: Permissions) => void) => void;
		remove: (p: Permissions, cb: (removed: boolean) => void) => void;
		request: (p: Permissions, cb: (granted: boolean) => void) => void;
	};
	tabs: {
		onUpdated: WebExtensionEvent<TabId>;
		insertCSS: (
			tabId: TabId,
			opts: ExecuteOptions,
			cb: (data: any) => void
		) => void;
		executeScript: (
			tabId: TabId,
			opts: ExecuteOptions,
			cb: (data: any) => void
		) => void;
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
		// Chrome uses callbacks instead of promises, so we promisify everything
		return {
			runtime: {
				openOptionsPage: () =>
					new Promise((resolve) => chrome!.runtime.openOptionsPage(resolve)),
				sendMessage: (m) =>
					new Promise((resolve) =>
						chrome!.runtime.sendMessage(undefined, m, undefined, resolve)
					),
				connect: chrome.runtime.connect.bind(chrome.runtime),
				onConnect: chrome.runtime.onConnect,
			},
			browserAction: chrome.browserAction,
			permissions: {
				getAll: () =>
					new Promise((resolve) => chrome!.permissions?.getAll(resolve)),
				request: (p) =>
					new Promise((resolve) => chrome!.permissions?.request(p, resolve)),
				remove: (p) =>
					new Promise((resolve) => chrome!.permissions?.remove(p, resolve)),
			},
			tabs: {
				insertCSS: (a, b) =>
					new Promise((resolve) => chrome!.tabs?.insertCSS(a, b, resolve)),
				executeScript: (a, b) =>
					new Promise((resolve) => chrome!.tabs?.executeScript(a, b, resolve)),
				onUpdated: chrome!.tabs?.onUpdated,
			},
			storage: {
				sync: {
					get: (key: string | string[]) =>
						new Promise((resolve) => {
							chrome!.storage.sync.get(key, resolve);
						}),
					set: chrome.storage.sync.set.bind(chrome!.storage.sync),
				},
			},
		};
	} else {
		throw new Error('Could not find WebExtension API');
	}
}
