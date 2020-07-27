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

		// For some reason, removing these nodes are causing CPU usage to
		// sit at 100% while the page is open. Same thing if they're set to
		// display: none in CSS. I suspect it's to do with infinite scroll
		// again, so I'm going to leave the nodes in the tree for now, CSS
		// takes care of hiding them. It just means there's a scrollbar that
		// scrolls into emptiness, but it's better than constantly chewing CPU
		// for now.
		//
		//removeNode(feed);
		//removeNode(stories);

		// Add News Feed Eradicator quote/info panel
		if (container && !isAlreadyInjected()) {
			injectUI(container);
		}
	}

	// This delay ensures that the elements have been created by Facebook's
	// scripts before we attempt to replace them
	setInterval(eradicateRetry, 1000);
}
