import injectUI, { isAlreadyInjected } from '../lib/inject-ui';
import { isEnabled } from '../lib/is-enabled';
import { Store } from '../store';
import { injectCSS } from './shared';

export function checkSite(): boolean {
	return (
		window.location.host.includes('twitter.com') ||
		window.location.host.includes('x.com')
	);
}

export function eradicate(store: Store) {
	injectCSS('twitter');

	function eradicateRetry() {
		const settings = store.getState().settings;
		if (settings == null || !isEnabled(settings)) {
			return;
		}

		// Determine if the user is logged in or not
		const isUserLoggedOut = document.querySelector('[data-testid="login"]');

		// Don't do anything if the UI hasn't loaded yet
		// Select the correct Twitter feed based on the user's login status
		let feed;
		if (isUserLoggedOut) {
			feed = document.querySelector(
				'div[data-testid="primaryColumn"] > div:last-child > div:nth-child(3)'
			);
		} else {
			feed = document.querySelector(
				'div[data-testid="primaryColumn"] > div:last-child > div:nth-child(4)'
			);
		}

		if (feed == null) {
			return;
		}

		const container = feed;

		// Add News Feed Eradicator quote/info panel
		if (container && !isAlreadyInjected()) {
			injectUI(container, store);
		}
	}

	// This delay ensures that the elements have been created by Twitter's
	// scripts before we attempt to replace them
	setInterval(eradicateRetry, 1000);
}
