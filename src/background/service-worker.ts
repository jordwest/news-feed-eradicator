import { createBackgroundStore } from './store/store';
import { getBrowser, TabId } from '../webextension';
import { Sites } from '../sites';

createBackgroundStore();

const browser = getBrowser();
browser.action.onClicked.addListener(() => {
	browser.runtime.openOptionsPage();
});

const tabMutex = new Set<number>();
const onTabChange = async (tabId: TabId) => {
	// // Ensures we're only running this listener once per tab simultaneously
	// if (tabMutex.has(tabId)) return;
	// tabMutex.add(tabId);
	//
	// try {
	// 	// Check first if the script has already been injected
	// 	const injectInfo = await (getBrowser().scripting.executeScript({
	// 		target: { tabId },
	// 		func: () => ({ host: window.location.host, loaded: document['nfeScriptsInjected'] || false }),
	// 		injectImmediately: true,
	// 	}) as Promise<{ result: { host: string; loaded: boolean } }[]>);
	//
	// 	console.info(injectInfo);
	//
	// 	if (
	// 		injectInfo != null &&
	// 		injectInfo[0] != null &&
	// 		injectInfo[0].result.loaded !== true
	// 	) {
	// 		// Inject them scripts (and CSS)
	// 		browser.scripting.insertCSS({
	// 			target: { tabId },
	// 			files: ['eradicate.css'],
	// 		});
	//
	// 		// Site specific CSS
	// 		for (let siteKey in Sites) {
	// 			const site = Sites[siteKey];
	// 			if (injectInfo[0].result.host.endsWith(site.domain)) {
	// 				const css = site.css;
	// 				if (css != null) {
	// 					browser.scripting.insertCSS({
	// 						target: { tabId },
	// 						css
	// 					});
	// 				}
	// 			}
	// 		}
	//
	// 		browser.scripting.executeScript({ target: { tabId }, files: ['intercept.js'], injectImmediately: true });
	// 		await browser.scripting.executeScript({
	// 			target: { tabId },
	// 			func: () => { document['nfeScriptsInjected'] = true },
	// 			injectImmediately: true,
	// 		});
	// 	} else {
	// 		// already injected or unavailable
	// 	}
	// } finally {
	// 	tabMutex.delete(tabId);
	// }
};

browser.tabs.onUpdated.addListener(onTabChange);
