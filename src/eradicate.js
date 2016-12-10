// Load any browser specific code. This is selected by webpack
var browser = require( 'browser-specific' );

// Include the stylesheets
require( './eradicate.css' );

import removeNewsFeed from './lib/remove-news-feed';
import injectUI, { isAlreadyInjected } from './lib/inject-ui';
import isEnabled from './lib/is-enabled';

// This delay ensures that the elements have been created by Facebook's
// scripts before we attempt to replace them
var eradicateRetry = setInterval(function(){
		if ( ! isEnabled() ) {
			return;
		}

		// Don't do anything if the FB UI hasn't loaded yet
		var streamContainer = document.getElementById('stream_pagelet');
		if ( streamContainer == null ) {
			return;
		}

		removeNewsFeed();

		// Add News Feed Eradicator quote/info panel
		if ( ! isAlreadyInjected() ) {
			injectUI( streamContainer );
		}
}, 1000);
