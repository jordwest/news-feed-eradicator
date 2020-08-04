import injectUI, { isAlreadyInjected } from '../lib/inject-ui';
import isEnabled from '../lib/is-enabled';

export function checkSite(): boolean {
	return window.location.host.includes('twitter.com');
}

export function eradicate() {
	function eradicateRetry() {
		if (!isEnabled()) {
			return;
		}

		// Don't do anything if the UI hasn't loaded yet
		const feed = document.querySelector(
			'div[data-testid="primaryColumn"] > div:last-child > div:nth-child(4)'
		);

		if (feed == null) {
			console.log('not ready yet');
			return;
		}

		const container = feed;

		// Add News Feed Eradicator quote/info panel
		if (container && !isAlreadyInjected()) {
			console.log('injecting into', feed);
			injectUI(container);
		}
	}

	// This delay ensures that the elements have been created by Twitter's
	// scripts before we attempt to replace them
	setInterval(eradicateRetry, 1000);
}
