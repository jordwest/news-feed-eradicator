/**
 * See the WebExtension API:
 * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API
 */
type WebExtensionAPI = {
	runtime: {
		openOptionsPage: () => Promise<void>;
		sendMessage(extensionId: string, message: any, options?: any): Promise<void>;
		sendMessage(message: any): Promise<void>;
		connect: () => Port;
		onConnect: WebExtensionEvent<Port>;
		onMessage: WebExtensionEvent<any>;
	};
	action: {
		onClicked: WebExtensionEvent<void>;
	};
	permissions: {
		getAll: () => Promise<Permissions>;
		remove: (p: Permissions) => Promise<boolean>;
		request: (p: Permissions) => Promise<boolean>;
	};
	tabs: {
		onUpdated: WebExtensionEvent<TabId>;
		sendMessage: (tabId: TabId, message: any) => Promise<void>;
	};
	scripting: {
		executeScript: (opts: ExecuteOptions) => Promise<any>;
		insertCSS: (opts: InsertCssOptions) => Promise<any>;
		registerContentScripts: (opts: RegisteredContentScript[]) => Promise<void>;
		unregisterContentScripts: () => Promise<void>;
	};
	storage: {
		sync: {
			get(keys: string | string[] | null): Promise<any>;
			set(keys: object): void;
		};
	};
};

export type TabId = number & { __tabId: never };

type InjectionTarget = {
	tabId: TabId;
};
type InsertCssOptions = {
	target: InjectionTarget;
	files?: string[];
	css?: string;
};
type ExecuteOptions = {
	target: { tabId: TabId };
	injectImmediately?: boolean;
	files?: string[];
	func?: () => void;
};

type RegisteredContentScript = {
	id: string;
	js?: string[];
	css?: string[];
	matches: string[];
	runAt: 'document_start' | 'document_end' | 'document_idle';
	allFrames: boolean;
	world?: 'MAIN' | 'ISOLATED';
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
	sender: {
		url: string;
		tab: {
			id: TabId;
			url: string;
		};
	};
};

declare var browser: WebExtensionAPI | undefined;
declare var chrome: WebExtensionAPI | undefined;

export function getBrowser(): WebExtensionAPI {
	if (typeof browser !== 'undefined') {
		return browser;
	} else if (typeof chrome !== 'undefined') {
		return chrome;
	} else {
		throw new Error('Could not find WebExtension API');
	}
}
