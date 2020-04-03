import { removeNode } from '../lib/remove-news-feed';
import injectUI, { isAlreadyInjected } from '../lib/inject-ui';
import isEnabled from '../lib/is-enabled';

//export function checkSite(): boolean {
//	return !!document.querySelector('#stream_pagelet');
//}

export function eradicate() {
	// This delay ensures that the elements have been created by Facebook's
	// scripts before we attempt to replace them
	function eradicateRetry() {
		if (!isEnabled()) {
			return;
		}

		// Don't do anything if the FB UI hasn't loaded yet
		const feed = document.querySelector('[role=feed]');
		if (feed == null) {
			return;
		}

		const container = feed.parentNode;
		removeNode(feed);

		// Add News Feed Eradicator quote/info panel
		if (!isAlreadyInjected()) {
			injectUI(container);
		}
	}

	setInterval(eradicateRetry, 1000);
}
