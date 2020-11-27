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

		let feedSelector: string = '';

		const feedSelector1 =
			'#dashboard > div > div:nth-child(3)[data-repository-hovercards-enabled]';
		const feedSelector2 =
			'#dashboard > div > div:nth-child(5)[data-repository-hovercards-enabled]';

		if (document.querySelector(feedSelector1)) {
			feedSelector = feedSelector1;
		} else if (document.querySelector(feedSelector2)) {
			feedSelector = feedSelector2;
		}

		// Don't do anything if the UI hasn't loaded yet
		if (feedSelector.length === 0) return;

		const proTipsSelector = '#dashboard > div > div.f6.text-gray.mt-4';
		const allActivityHeader =
			'#dashboard > div > h2.f4.text-normal.js-all-activity-header';

		remove({ toRemove: [feedSelector, proTipsSelector, allActivityHeader] });

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
