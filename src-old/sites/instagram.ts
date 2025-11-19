import injectUI, { isAlreadyInjected } from '../lib/inject-ui';
import { isEnabled } from '../lib/is-enabled';
import { Store } from '../store';
import {injectCSS} from "./shared";

export function checkSite(): boolean {
	return window.location.host.includes('instagram.com');
}

export function eradicate(store: Store) {
	injectCSS('instagram');

	function eradicateRetry() {
		const settings = store.getState().settings;
		if (settings == null || !isEnabled(settings)) {
			return;
		}

		// Don't do anything if the UI hasn't loaded yet
		const feed = document.querySelector('main');
		if (feed == null) {
			return;
		}

		const container = feed;

		// Add News Feed Eradicator quote/info panel
		if (feed && !isAlreadyInjected()) {
			injectUI(feed, store);
		}
	}

	// This delay ensures that the elements have been created by Twitter's
	// scripts before we attempt to replace them
	setInterval(eradicateRetry, 1000);
}
