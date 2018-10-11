// Load any browser specific code. This is selected by webpack
import * as browser from './webextension';

// Include the stylesheets
import './eradicate.css';

import removeNewsFeed from './lib/remove-news-feed';
import injectUI, { isAlreadyInjected } from './lib/inject-ui';
import isEnabled from './lib/is-enabled';

// This delay ensures that the elements have been created by Facebook's
// scripts before we attempt to replace them
var eradicateRetry = setInterval(function() {
	if (!isEnabled()) {
		return;
	}

	// Don't do anything if the FB UI hasn't loaded yet
	var streamContainer = document.getElementById('stream_pagelet');
	if (streamContainer == null) {
		return;
	}

	removeNewsFeed();

	// Add News Feed Eradicator quote/info panel
	if (!isAlreadyInjected()) {
		injectUI(streamContainer);
	}
}, 1000);
