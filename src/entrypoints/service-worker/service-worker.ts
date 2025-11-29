import { getBrowser, type TabId } from '../../lib/webextension';
import type { SiteList } from '../../types/sitelist';
import type { ContentScriptMessage, OptionsPageMessage, ServiceWorkerMessage } from '../../messaging/messages';
import { upgradeStorage } from '../../types/storage';

const browser = getBrowser();
browser.action.onClicked.addListener(() => {
	browser.runtime.openOptionsPage();
});

const siteListUrl = browser.runtime.getURL('sitelist.json');
const siteListPromise: Promise<SiteList> = fetch(siteListUrl).then(siteList => siteList.json());

const sendMessage = (tabId: TabId, message: ServiceWorkerMessage) => browser.tabs.sendMessage(tabId, message);

browser.runtime.onMessage.addListener(async (msg: ContentScriptMessage | OptionsPageMessage, sender) => {
	if (msg.type === 'requestSiteDetails') {
		const siteList = await siteListPromise;

		const url = new URL(sender.url);
		console.log(url);
		const site = siteList.sites.find(site => site.hosts.includes(url.host));
		if (site != null) {
			console.log('Site found', site)

			let styles: string[] = site.styles
				.map(style => {
					const selector = style.selectors.join(',');
					// TODO: Sanitize selector!
					// return `${selector} { opacity: 0 !important; pointer-events: none !important; }`
					return `${selector} { opacity: 0.25 !important; filter: blur(3px) !important; pointer-events: none !important; }`
					// return `${selector} { filter: sepia(100%) !important; }`
				})

			if (site.feed != null) {
				styles = styles.concat(...site.feed.selectors.map(selector => `${selector} { opacity: 0 !important; pointer-events: none !important; }`))
			}

			const css = styles.join('\n')
			console.log('sending site details', css);

			sendMessage(sender.tab.id, {
				type: 'nfe#siteDetails',
				css,
				feed: site.feed ?? null,
				token: msg.token,
			})
		}
	}

	if (msg.type === 'disableSite') {
		const siteList = await siteListPromise;
		const site = siteList.sites.find(site => site.id === msg.siteId);
		if (site == null) {
			return;
		}

		// This will only return tabs which we have permission to access, so we can message every relevant tab
		const tabs = await browser.tabs.query({url: '*://*/*'});

		await Promise.all(
			tabs.map(tab => {
				console.log('notify tab', tab)
				return sendMessage(tab.id, { type: 'nfe#optionsUpdated' })
			})
		);
	}

	if (msg.type === 'snooze') {
		const settings = await browser.storage.sync.get(null).then(upgradeStorage);
		settings.sleepUntil = msg.until;
		browser.storage.sync.set(settings);
	}

	if (msg.type === 'injectCss') {
		console.log('inserting css', msg.css);
		await browser.scripting.insertCSS({
			target: { tabId: sender.tab.id },
			css: msg.css,
		});
	}

	if (msg.type === 'removeCss') {
		console.log('removing css', msg.css);
		await browser.scripting.removeCSS({
			target: { tabId: sender.tab.id },
			css: msg.css,
		});
	}
});
