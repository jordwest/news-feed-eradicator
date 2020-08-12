import { createBackgroundStore } from './store/store';
import { getBrowser, TabId } from '../webextension';

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
			browser.tabs.executeScript(tabId, {
				file: 'intercept.js',
				runAt: 'document_start',
			});
			await browser.tabs.executeScript(tabId, {
				code: 'document.nfeScriptsInjected = true;',
				runAt: 'document_start',
			});
		} else {
			console.log('already injected or unavailable');
		}
	} finally {
		tabMutex.delete(tabId);
	}
};

browser.tabs.onUpdated.addListener(onTabChange);
