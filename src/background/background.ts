import { createSettingsStore } from './store/store';
import { getBrowser, TabId } from '../webextension';

createSettingsStore();

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
			getBrowser().tabs.insertCSS(tabId, {
				file: 'eradicate.css',
				runAt: 'document_start',
			});
			getBrowser().tabs.executeScript(tabId, {
				file: 'intercept.js',
				runAt: 'document_start',
			});
			getBrowser().tabs.executeScript(tabId, {
				file: 'eradicate.js',
				runAt: 'document_idle',
			});
			await getBrowser().tabs.executeScript(tabId, {
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

(getBrowser() as any).tabs.onUpdated.addListener(onTabChange);
