import { getBrowser, type MessageSender, type TabId } from '/lib/webextension';
import type { Region, Site, SiteId } from '/types/sitelist';
import type { DesiredRegionState, RequestQuoteResponse, FromServiceWorkerMessage, ToServiceWorkerMessage } from '/messaging/messages';
import { loadHideQuotes, loadQuoteLists, loadRegionsForSite, loadSitelist, loadSnoozeUntil, migrationPromise, saveQuoteEnabled, saveSiteEnabled, saveSnoozeUntil, saveThemeForSite } from '/storage/storage';
import { originsForSite } from '/lib/util';
import { BuiltinQuotes, type Quote } from '/quote';
import type { QuoteListId, Theme } from '/storage/schema';
import themeDark from '/themes/dark.css?raw';
import themeLight from '/themes/light.css?raw';

const browser = getBrowser();
browser.action.onClicked.addListener(() => {
	browser.runtime.openOptionsPage();
});

const sendMessage = (tabId: TabId, message: FromServiceWorkerMessage) => browser.tabs.sendMessage(tabId, message);

browser.runtime.onInstalled.addListener(async () => {
	await migrationPromise;
	const sync = await browser.storage.sync.get(null);
	const local = await browser.storage.local.get(null);

	console.log('Extension installed. Storage sync:', sync, 'local', local);

	for (const siteId of local.enabledSites ?? []) {
		await enableSite(siteId);
	}
});

const notifyTabsOptionsUpdated = async () => {
	// This will only return tabs which we have permission to access, so we can message
	// every relevant tab that's running the content script
	const tabs = await browser.tabs.query({url: '*://*/*'});

	try {
		await Promise.allSettled(
			tabs.map(tab => {
				console.log('notify tab', tab)
				return sendMessage(tab.id, { type: 'nfe#optionsUpdated' })
			})
		);
	} catch (e) {
		// Ignore inevitable errors due to not having permissions for irrelevant tabs
	}
}

const isEnabledPath = (site: Site, path: string): boolean | undefined => {
	console.log('checking path', path, 'against', site.paths);
	return site.paths.includes(path);
}

const cssForType = (type: Region['type']): string => {
	switch (type) {
		case 'remove':
			return 'display: none !important;';
		case 'hide':
			return 'opacity: 0.1 !important; filter: blur(32px) !important; pointer-events: none !important;';
		case 'dull':
			return 'filter: grayscale(100%) !important';
		default:
			return '';
	}
}

const sanitizeSelector = (selector: string): string => {
	// TODO - make this more robust and add tests
	return selector.replaceAll('{', '').replaceAll('}', '');
}

const enableSite = async (siteId: SiteId) => {
	const siteList = await loadSitelist();
	const site = siteList.sites.find(site => site.id === siteId);
	if (site == null) {
		return false;
	}

	const origins = originsForSite(site);

	await Promise.allSettled([
		saveSiteEnabled(site.id, true),

		browser.scripting.registerContentScripts([{
			id: site.id,
			js: ['/entrypoints/intercept/intercept.js'],
			runAt: "document_start",
			matches: origins,
			allFrames: false,
			// world: "MAIN"
		}]),
	]);
}

const requestQuote = async () => {
	const quoteLists = await loadQuoteLists();

	const activeQuotes: { quoteListId: QuoteListId, quote: Quote }[] = quoteLists
		.filter(list => !list.disabled)
		.map(list => {
			const listQuotes = list.quotes === 'builtin' ? BuiltinQuotes : list.quotes;
			return listQuotes
				.filter(q => !list.disabledQuoteIds.includes(q.id.toString()))
				.map(q => ({ quoteListId: list.id, quote: q }))
		}).flat();

	const idx = Math.floor(Math.random() * activeQuotes.length);
	const quote = activeQuotes[idx]!;
	const response: RequestQuoteResponse = { quoteListId: quote.quoteListId, ...quote.quote };
	return response;
}

const setSiteTheme = async (siteId: SiteId, theme: Theme | null) => {
	await saveThemeForSite(siteId, theme ?? undefined);
	notifyTabsOptionsUpdated();
}

const handleMessage = async (msg: ToServiceWorkerMessage, sender: MessageSender) => {
	if (msg.type === 'requestSiteDetails') {
		// TODO: Cache these?
		const siteList = await loadSitelist();
		const snoozeUntil = await loadSnoozeUntil();
		const hideQuotes = await loadHideQuotes();

		const isSnoozing = snoozeUntil != null && snoozeUntil > Date.now();

		const url = new URL(sender.url);
		console.log(url);
		const site = siteList.sites.find(site => site.hosts.includes(url.host));

		if (site != null) {
			const siteOptions = await loadRegionsForSite(site.id);

			console.log('Site found', site, siteOptions)

			let regions = site.regions
				.map((region): DesiredRegionState => {
					if (isSnoozing || (region.paths !== '*' && !isEnabledPath(site, msg.path))) {
						return { config: region, css: null, enabled: false };
					}

					const enabled = siteOptions.regionEnabledOverride[region.id] ?? region.default ?? true;

					const selector = region.selectors.map(sanitizeSelector).join(',');
					return { config: region, css: `${selector} { ${cssForType(region.type)} }`, enabled } ;
				});

			console.log('sending site details', regions);

			const theme = siteOptions.theme ?? 'light';

			sendMessage(sender.tab.id, {
				type: 'nfe#siteDetails',
				regions,
				token: msg.token,
				snoozeUntil: snoozeUntil ?? null,
				siteId: site.id,
				hideQuotes,
				theme: {
					css: theme === 'light' ? themeLight : themeDark,
					id: theme,
				}
			})
		}
	}

	if (msg.type === 'requestQuote') {
		return requestQuote();
	}

	if (msg.type === 'enableSite') {
		const result = await enableSite(msg.siteId);
		notifyTabsOptionsUpdated();
		return result;
	}

	if (msg.type === 'openOptionsPage') {
		browser.runtime.openOptionsPage();
	}

	if (msg.type === 'setQuoteEnabled') {
		return await saveQuoteEnabled(msg.quoteListId, msg.id, msg.enabled);
	}

	if (msg.type === 'notifyOptionsUpdated') {
		notifyTabsOptionsUpdated();
	}

	if (msg.type === 'disableSite') {
		await browser.scripting.unregisterContentScripts({ ids: [msg.siteId]});

		const siteList = await loadSitelist();
		const site = siteList.sites.find(site => site.id === msg.siteId);
		if (site == null) return;

		await saveSiteEnabled(site.id, false);

		notifyTabsOptionsUpdated();
	}

	if (msg.type === 'snooze') {
		await saveSnoozeUntil(msg.until)

		notifyTabsOptionsUpdated();
	}

	if (msg.type === 'readSnooze') {
		return await loadSnoozeUntil() ?? null;
	}

	if (msg.type === 'setSiteTheme') {
		return setSiteTheme(msg.siteId, msg.theme);
	}

	if (msg.type === 'injectCss') {
		console.log('inserting css', msg.css);
		await browser.scripting.insertCSS({
			target: { tabId: sender.tab.id },
			css: msg.css,
		});

		return { css: msg.css };
	}

	if (msg.type === 'removeCss') {
		console.log('removing css', msg.css);
		await browser.scripting.removeCSS({
			target: { tabId: sender.tab.id },
			css: msg.css,
		});

		return { css: msg.css };
	}
}

browser.runtime.onMessage.addListener((msg: ToServiceWorkerMessage, sender, sendResponse) => {
	handleMessage(msg, sender).then(sendResponse);
	return true;
});
