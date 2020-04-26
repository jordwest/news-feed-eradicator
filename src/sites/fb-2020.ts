import { removeNode } from '../lib/remove-news-feed';
import injectUI, { isAlreadyInjected } from '../lib/inject-ui';
import isEnabled from '../lib/is-enabled';

//export function checkSite(): boolean {
//	return !!document.querySelector('#stream_pagelet');
//}

export function eradicate() {
	function eradicateRetry() {
		if (!isEnabled()) {
			return;
		}

		// Don't do anything if the FB UI hasn't loaded yet
		const feed = document.querySelector('[role=feed]');
		const stories = document.querySelector('[aria-label=Stories]');
		
		if (feed == null) {
			return;
		}

		const container = feed.parentNode;
		removeNode(feed);
		removeNode(stories);

		// Add News Feed Eradicator quote/info panel
		if (!isAlreadyInjected()) {
			injectUI(container);
		}
	}

	// This delay ensures that the elements have been created by Facebook's
	// scripts before we attempt to replace them
	setInterval(eradicateRetry, 1000);
}
