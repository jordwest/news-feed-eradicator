import { createBackgroundStore } from './store/store';
import { getBrowser, TabId } from '../webextension';
import {Sites} from "../sites";

createBackgroundStore();

const browser = getBrowser();
browser.browserAction.onClicked.addListener(() => {
	browser.runtime.openOptionsPage();
});

const tabMutex = new Set<number>();
const onTabChange = async (tabId: TabId) => {
	// Ensures we're only running this listener once per tab simultaneously
	if (tabMutex.has(tabId)) return;
	tabMutex.add(tabId);

	try {
		// Check first if the script has already been injected
		const injectInfo = await getBrowser().tabs.executeScript<{
			host: string;
			loaded: boolean;
		}>(tabId, {
			code:
				'({ host: window.location.host, loaded: document.nfeScriptsInjected || false });',
			runAt: 'document_start',
		});

		if (
			injectInfo != null &&
			injectInfo[0] != null &&
			injectInfo[0].loaded !== true
		) {
			// Inject them scripts (and CSS)
			browser.tabs.insertCSS(tabId, {
				file: 'eradicate.css',
				runAt: 'document_start',
			});
			
			// Site specific CSS
			for(let siteKey in Sites) {
				console.log('checking', siteKey, 'against', injectInfo[0].host);
				const site = Sites[siteKey];
				console.log(site);
				if (injectInfo[0].host.endsWith(site.domain)) {
					const css = site.css;
					console.log('matches. css is', css);
					if (css != null) {
						browser.tabs.insertCSS(tabId, {
							code: css,
							runAt: 'document_start',
						});
					}
				}
			}
			
			browser.tabs.executeScript(tabId, {
				file: 'intercept.js',
				runAt: 'document_start',
			});
			await browser.tabs.executeScript(tabId, {
				code: 'document.nfeScriptsInjected = true;',
				runAt: 'document_start',
			});
		} else {
			// already injected or unavailable
		}
	} finally {
		tabMutex.delete(tabId);
	}
};

browser.tabs.onUpdated.addListener(onTabChange);
