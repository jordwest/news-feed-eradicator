import type { Feed } from "../types/sitelist";

export type ServiceWorkerMessage = SetTabCss;

// Ask a tab to inject/change/remove some CSS.
type SetTabCss = {
	type: 'nfe#siteDetails',
	token: number,
	css: string | null,
	feed: Feed | null,
}

export type ContentScriptMessage = RequestSiteDetails | InjectCss | RemoveCss;

// Request site details from service worker.
type RequestSiteDetails = {
	type: 'requestSiteDetails',
	token: number
};

// Content script asking for css to be injected into the page. This can only be done on the service worker.
type InjectCss = {
	type: 'injectCss',
	css: string,
}
// Content script asking for css to be removed from the page. This can only be done on the service worker.
type RemoveCss = {
	type: 'removeCss',
	css: string,
}
