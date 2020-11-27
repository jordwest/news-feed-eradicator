import injectUI, { isAlreadyInjected } from '../lib/inject-ui';
import { isEnabled } from '../lib/is-enabled';
import { remove } from '../lib/remove-news-feed';
import { Store } from '../store';

export function checkSite(): boolean {
	return window.location.host.includes('github.com');
}

export function eradicate(store: Store) {
	function eradicateRetry() {
		const settings = store.getState().settings;
		if (settings == null || !isEnabled(settings)) {
			return;
		}

		const feedSelector =
      '#dashboard > div > div:nth-child(3)[data-repository-hovercards-enabled]';
    
		// Don't do anything if the UI hasn't loaded yet
		const feed = document.querySelector(feedSelector);
		if (feed == null) {
			return;
		}

    const proTipsSelector = '#dashboard > div > div.f6.text-gray.mt-4'

		remove({ toRemove: [feedSelector, proTipsSelector] });

		const container = document.querySelector(
			'body > div.application-main > div > div > div > main'
		);

		// Add News Feed Eradicator quote/info panel
		if (container && !isAlreadyInjected()) {
			injectUI(container, store);
		}
	}

	// This delay ensures that the elements have been created by Twitter's
	// scripts before we attempt to replace them
	setInterval(eradicateRetry, 1000);
}
