import { getBrowser } from "/lib/webextension";
import type { QuoteListId, Theme } from "/storage/schema";
import type { Region, SiteId } from "/types/sitelist";

export const sendToServiceWorker = async <Response = any>(msg: ToServiceWorkerMessage): Promise<Response> => {
	const browser = getBrowser();
	return browser.runtime.sendMessage(msg);
}

export type FromServiceWorkerMessage = SiteDetails | OptionsUpdated;

/**
 * Respond to a content script with site details
 */
type SiteDetails = {
	type: 'nfe#siteDetails',
	token: number,
	siteId: SiteId,
	regions: DesiredRegionState[],
	theme: {
		id: Theme,
		css: string,
	}
	widgetStyle: 'contained' | 'transparent',
	snoozeUntil: number | null,
	hideQuotes: boolean,
}

export type DesiredRegionState = {
	config: Region,
	css: string | null,
	enabled: boolean,
}

/**
 * Sent to content scripts to notify them that the options have changed and they will need to request an update
 */
type OptionsUpdated = {
	type: 'nfe#optionsUpdated',
}

export type ToServiceWorkerMessage = RequestSiteDetails | OpenOptionsPage | NotifyOptionsUpdated | SetSiteTheme | EnableSite | DisableSite | Snooze | RequestQuote | SetQuoteEnabled | InjectCss | RemoveCss | ReadSnooze;

// Request site details from service worker.
type RequestSiteDetails = {
	type: 'requestSiteDetails',
	path: string,
	token: number
};

type OpenOptionsPage = {
	type: 'openOptionsPage',
};

type NotifyOptionsUpdated = {
	type: 'notifyOptionsUpdated',
}

export type RequestQuote = {
	type: 'requestQuote',
}

export type SetQuoteEnabled = {
	type: 'setQuoteEnabled',
	quoteListId: QuoteListId,
	id: string,
	enabled: boolean,
}

export type RequestQuoteResponse = {
	quoteListId: QuoteListId,
	id: string,
	text: string,
	author: string,
} | null;

type EnableSite = {
	type: 'enableSite',
	siteId: SiteId,
}

type SetSiteTheme = {
	type: 'setSiteTheme',
	siteId: SiteId,
	theme: Theme | null,
}

type DisableSite = {
	type: 'disableSite',
	siteId: SiteId,
}

type Snooze = {
	type: 'snooze',
	until: number
}

type ReadSnooze = {
	type: 'readSnooze',
}
