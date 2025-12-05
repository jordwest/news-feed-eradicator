import { getBrowser, type MessageSender, type SendResponse, type TabId } from '../../lib/webextension';
import type { Feed, Region, Site, SiteList } from '../../types/sitelist';
import type { ContentScriptMessage, DesiredRegionState, OptionsPageMessage, ServiceWorkerMessage } from '../../messaging/messages';
import { upgradeStorage } from '../../types/storage';

const browser = getBrowser();
browser.action.onClicked.addListener(() => {
	browser.runtime.openOptionsPage();
});

const siteListUrl = browser.runtime.getURL('sitelist.json');
const siteListPromise: Promise<SiteList> = fetch(siteListUrl).then(siteList => siteList.json());

const sendMessage = (tabId: TabId, message: ServiceWorkerMessage) => browser.tabs.sendMessage(tabId, message);

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

const handleMessage = async (msg: ContentScriptMessage | OptionsPageMessage, sender: MessageSender) => {
	if (msg.type === 'requestSiteDetails') {
		const siteList = await siteListPromise;
		const settings = await browser.storage.sync.get(null).then(upgradeStorage);
		const isSnoozing = settings.snoozeUntil != null && settings.snoozeUntil > Date.now();

		const url = new URL(sender.url);
		console.log(url);
		const site = siteList.sites.find(site => site.hosts.includes(url.host));

		if (site != null) {
			console.log('Site found', site)

			let regions = site.regions.map((region): DesiredRegionState => {
				if (isSnoozing || (region.paths !== '*' && !isEnabledPath(site, msg.path))) {
					return { config: region, css: null, enabled: false };
				}

				const selector = region.selectors.map(sanitizeSelector).join(',');
				return { config: region, css: `${selector} { ${cssForType(region.type)} }`, enabled: true } ;
			});

			console.log('sending site details', regions);

			sendMessage(sender.tab.id, {
				type: 'nfe#siteDetails',
				regions,
				token: msg.token,
				snoozeUntil: settings.snoozeUntil ?? null,
			})
		}
	}

	if (msg.type === 'disableSite') {
		const siteList = await siteListPromise;
		const site = siteList.sites.find(site => site.id === msg.siteId);
		if (site == null) {
			return;
		}

		notifyTabsOptionsUpdated();
	}

	if (msg.type === 'snooze') {
		const settings = await browser.storage.sync.get(null).then(upgradeStorage);
		settings.snoozeUntil = msg.until;
		browser.storage.sync.set(settings);
		console.log('settings', settings);

		notifyTabsOptionsUpdated();
	}

	if (msg.type === 'readSnooze') {
		const settings = await browser.storage.sync.get(null).then(upgradeStorage);
		return settings.snoozeUntil ?? null;
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

browser.runtime.onMessage.addListener((msg: ContentScriptMessage | OptionsPageMessage, sender, sendResponse) => {
	handleMessage(msg, sender).then(sendResponse);
	return true;
});
