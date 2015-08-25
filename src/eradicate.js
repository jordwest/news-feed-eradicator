// Load any browser specific code. This is selected by webpack
var browser = require( 'browser-specific' );

// Include the stylesheets
require( './eradicate.css' );

var forEach = require('lodash/collection/foreach');

var React = require('react');

var NewsFeedEradicator = require('./components/index.jsx');

// This delay ensures that the elements have been created by Facebook's
// scripts before we attempt to replace them
var eradicateRetry = setInterval(function(){
	// Add News Feed Eradicator display
	var streamContainer = document.getElementById('stream_pagelet');
	if ( streamContainer === null || typeof streamContainer === 'undefined' ) {
		return;
	}

	var newsFeedFound = false;
	// Delete the stream to prevent its infinite scroll infinitely loading
	// new stories (even though they are hidden)
	var streamMatcher = /^topnews_main_stream/;
	forEach(streamContainer.children, (child) => {
		if(streamMatcher.test(child.id)) {
			streamContainer.removeChild(child);

			newsFeedFound = true;

			// Exit the foreach
			return false;
		}
	});

	if ( ! newsFeedFound ) {
		return;
	}

	var nfeContainer = document.createElement("div");
	nfeContainer.id = "nfe-container";
	streamContainer.appendChild(nfeContainer);

	React.render(
		React.createElement(NewsFeedEradicator, null),
		nfeContainer
	);
}, 1000);
