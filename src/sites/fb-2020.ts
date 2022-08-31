import injectUI, { isAlreadyInjected } from '../lib/inject-ui';
import { isEnabled } from '../lib/is-enabled';
import { Store } from '../store';

//export function checkSite(): boolean {
//	return !!document.querySelector('#stream_pagelet');
//}

export function eradicate(store: Store) {
	function eradicateRetry() {
		const settings = store.getState().settings;
		if (settings == null || !isEnabled(settings)) {
			return;
		}

		// Remove notification text from document.title (i.e. '(7)' in '(7) Facebook')
		if (document.title !== 'Facebook') {
			document.title = 'Facebook';
		}

		// Don't do anything if the FB UI hasn't loaded yet
		const feed =
			document.querySelector('[role=feed]') || // For home and groups feed
			document.querySelector('[data-pagelet=MainFeed]') || // For watch and marketplace feeds
			document.querySelector('div[aria-label=Gaming][role=main]'); // For gaming feed

		if (feed == null) {
			return;
		}

		const container = feed.parentNode;

		// Add News Feed Eradicator quote/info panel
		if (container && !isAlreadyInjected()) {
			injectUI(container, store);
			remove_story();
		}
	}

	// This delay ensures that the elements have been created by Facebook's
	// scripts before we attempt to replace them
	setInterval(eradicateRetry, 1000);
}

//@ts-nocheck
function remove_story(){
	let story = document.querySelector('[role=region]')
	if (story == null) {
		return
	}

	// Hidden all story feeds
	for (let i = 0; i <  story.children[1].children[0].children.length; i++) {
		// Still able to create new story
		if (i == 0) {
			continue
		}
		let child = story.children[1].children[0].children[i]
		// Make others' story invisible and unclickable
		// @ts-ignore
		child.style.opacity = 0
		// @ts-ignore
		child.style['pointer-events'] = 'none'
	}
	// @ts-ignore
	story.children[2].hidden = true 
	
	
}