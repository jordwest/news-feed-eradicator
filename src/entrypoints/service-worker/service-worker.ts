import { createResource } from 'solid-js';
import { getBrowser, type Port } from '../../lib/webextension';
import type { SiteList } from '../../types/sitelist';

const browser = getBrowser();
browser.action.onClicked.addListener(() => {
	browser.runtime.openOptionsPage();
});

const siteListUrl = browser.runtime.getURL('sitelist.json');
const siteListPromise: Promise<SiteList> = fetch(siteListUrl).then(siteList => siteList.json());

browser.runtime.onConnect.addListener((port) => {
	console.log('Connected:', port.sender);

	let keepTrying = true;

	// Because Chrome starts loading the page as soon as the
	// user starts typing the URL, the tab reference is invalid
	// and cannot be injected. Here we keep retrying until the
	// injection is successful or the page unloads.
	const messageTabOnRepeat = async (token: number) => {
		if (keepTrying == false) return;
		console.log("Ping tab", port.sender.tab.url, port.sender.url)
		const tabId = port.sender.tab.id;
		browser.tabs.sendMessage(tabId, { type: 'acknowledgeTab', tabId: port.sender.tab.id, token });
		console.log('port', port)

		setTimeout(() => messageTabOnRepeat(token), 1);
	}

	port.onMessage.addListener(async (message) => {
		if (message.type === 'scriptInjected') {
			console.log('injecting css');
			console.log('sender', port.sender);

			messageTabOnRepeat(message.token);
		}

		if (message.type === 'injectCSS') {
			console.log('injecting css');
			console.log('sender', port.sender);

			keepTrying = false;

			const siteList = await siteListPromise;

			const url = new URL(port.sender.url);
			console.log(url);
			const site = siteList.sites.find(site => site.hosts.includes(url.host));
			if (site != null) {
				console.log('Site found', site)

				browser.tabs.sendMessage(port.sender.tab.id, { type: 'injectFeed', feed: site.feed })

				let styles: string[] = site.styles
					.map(style => {
						const selector = style.selectors.join(',');
						// return `${selector} { opacity: 0 !important; pointer-events: none !important; }`
						return `${selector} { opacity: 0.25 !important; filter: blur(3px) !important; pointer-events: none !important; }`
						// return `${selector} { filter: sepia(100%) !important; }`
					})

				if (site.feed != null) {
					styles = styles.concat(...site.feed.selectors.map(selector => `${selector} { opacity: 0 !important; pointer-events: none !important; }`))
				}

				const css = styles.join('\n')
				console.log('injecting', css);

				await browser.scripting.insertCSS({
					target: { tabId: port.sender.tab.id },
					css,
				})
			}
		}
	});

	port.onDisconnect.addListener(() => {
		console.log('Disconnected:', port.sender);
		keepTrying = false;
	});
});
