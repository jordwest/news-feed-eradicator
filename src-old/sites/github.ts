import injectUI, { isAlreadyInjected } from '../lib/inject-ui';
import { isEnabled } from '../lib/is-enabled';
import { remove } from '../lib/remove-news-feed';
import { Store } from '../store';
import {injectCSS} from "./shared";

export function checkSite(): boolean {
	return window.location.host.includes('github.com');
}

export function eradicate(store: Store) {
	injectCSS('github');

	function eradicateRetry() {
		const settings = store.getState().settings;
		if (settings == null || !isEnabled(settings)) {
			return;
		}

		// Don't do anything if the UI hasn't loaded yet
		const feed = document.querySelector('#dashboard-feed-frame');
		if (feed === null) return;

		const container = feed;

		// Add News Feed Eradicator quote/info panel
		if (container && !isAlreadyInjected()) {
			injectUI(container, store);
		}
	}

	// This delay ensures that the elements have been created by GitHub's
	// scripts before we attempt to replace them
	setInterval(eradicateRetry, 1000);
}
