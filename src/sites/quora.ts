import injectUI, {isAlreadyInjected} from '../lib/inject-ui';
import {isEnabled} from '../lib/is-enabled';
import {Store} from '../store';

export function checkSite(): boolean {
	return window.location.host.includes('quora.com');
}
export function eradicate(store: Store) {
	function eradicateRetry() {
		const settings = store.getState().settings;
		if (settings == null || !isEnabled(settings)) {
			return;
		}

		// Don't do anything if the UI hasn't loaded yet
		const feed = document.querySelector("#mainContent");

		if (feed == null) {
			return;
		}

		const container = feed;

		// Add News Feed Eradicator quote/info panel
		if (container && !isAlreadyInjected()) {

			injectUI(container, store);
		}
	}
	setInterval(eradicateRetry, 1000);
}