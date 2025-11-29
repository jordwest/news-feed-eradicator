import type { Feed, SiteId } from "../types/sitelist";

export type ServiceWorkerMessage = SetTabCss | OptionsUpdated;

/**
 * Respond to a content script with site details
 */
type SetTabCss = {
	type: 'nfe#siteDetails',
	token: number,
	css: string | null,
	feed: Feed | null,
}

/**
 * Sent to content scripts to notify them that the options have changed and they will need to request an update
 */
type OptionsUpdated = {
	type: 'nfe#optionsUpdated',
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

export type OptionsPageMessage = DisableSite | Snooze;

type DisableSite = {
	type: 'disableSite',
	siteId: SiteId,
}

type Snooze = {
	type: 'snooze',
	until: number
}
