/**
 * See the WebExtension API:
 * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API
 */
type WebExtensionAPI = {
	runtime: {
		openOptionsPage: () => Promise<void>;
		sendMessage(extensionId: string, message: any, options?: any): Promise<void>;
		sendMessage(message: any): Promise<any>;
		connect: () => Port;
		getURL: (resource: string) => string;
		onConnect: WebExtensionEvent<Port>;
		onMessage: WebExtensionEvent3<any, MessageSender, SendResponse>;
		onInstalled: WebExtensionEvent<OnInstalledDetails>;
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
		query: (queryInfo: QueryInfo) => Promise<Tab[]>;
	};
	scripting: {
		executeScript: (opts: ExecuteOptions) => Promise<any>;
		insertCSS: (opts: InsertCssOptions) => Promise<any>;
		removeCSS: (opts: InsertCssOptions) => Promise<any>;
		registerContentScripts: (opts: RegisteredContentScript[]) => Promise<void>;
		getRegisteredContentScripts: () => Promise<RegisteredContentScript[]>;
		unregisterContentScripts: (filter?: ContentScriptFilter) => Promise<void>;
	};
	storage: {
		local: Storage,
		sync: Storage,
	};
};

export type TabId = number & { __tabId: never };

type Storage = {
	get(keys: string | string[] | null): Promise<any>;
	set(keys: object): Promise<void>;
	remove(keys: string | string[]): Promise<void>;
};

type OnInstalledDetails = {
	previousVersion?: string,
	reason: 'install' | 'update' | 'browser_update' | 'shared_module_update',
	temporary: boolean,
};
type ContentScriptFilter = {
	ids: string[],
};
type QueryInfo = {
	url?: string | string[];
};
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
type WebExtensionEvent2<Arg, Arg2> = {
	addListener: (cb: (a: Arg, b: Arg2) => void) => void;
};
type WebExtensionEvent3<Arg, Arg2, Arg3> = {
	addListener: (cb: (a: Arg, b: Arg2, c: Arg3) => void) => void;
};

export type Permissions = {
	permissions: string[];
	origins: string[];
};

type Tab = {
	id: TabId;
	url: string;
};

export type MessageSender = {
	url: string;
	tab: Tab;
};

export type SendResponse = (response: any) => void;

export type Port = {
	postMessage(msg: any): void;
	onDisconnect: WebExtensionEvent<Port>;
	onMessage: WebExtensionEvent2<any, MessageSender>;
	sender: MessageSender;
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
