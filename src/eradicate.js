// Load any browser specific code. This is selected by webpack
var browser = require( 'browser-specific' );

// Include the stylesheets
require( './eradicate.css' );

var forEach = require('lodash/collection/forEach');

var React = require('react');
var ReactDOM = require('react-dom');

var NewsFeedEradicator = require('./components/index.jsx');

import { Provider } from 'react-redux';
import { createStore } from './store';

var storePromise = createStore();

const handleError = ( e ) => {
	console.error( '-------------------------------------' );
	console.error( 'Something went wrong loading News Feed Eradicator. Please take a screenshot of these details:' );
	console.error( e.stack );
	console.error( '-------------------------------------' );
}


function getCleanedStreamContainer() {
	if(/facebook\.com$/.test(location.hostname)) {
		var streamContainer = document.getElementById('stream_pagelet');
		if ( streamContainer === null || typeof streamContainer === 'undefined' ) {
			return;
		}

		// Delete the stream to prevent its infinite scroll infinitely loading
		// new stories (even though they are hidden)
		var streamMatcher = /^topnews_main_stream/;
		forEach(streamContainer.children, (child) => {
			if(streamMatcher.test(child.id)) {
				streamContainer.removeChild(child);

				// Exit the foreach
				return false;
			}
		});

		return streamContainer;
	} else if(/vk\.com$/.test(location.hostname)) {
		var streamContainer = document.querySelector('#feed_wall');
		streamContainer.innerHTML = '';

		return streamContainer;
	}
}

// This delay ensures that the elements have been created by Facebook's
// scripts before we attempt to replace them
var eradicateRetry = setInterval(function(){
	try {
		// Add News Feed Eradicator display
		var streamContainer = getCleanedStreamContainer();
		if(!streamContainer) {
			return;
		}

		var nfeContainer = document.createElement("div");
		nfeContainer.id = "nfe-container";
		streamContainer.appendChild(nfeContainer);

		storePromise.then( ( store ) => {
			ReactDOM.render(
				React.createElement( Provider, { store: store, children: React.createElement( NewsFeedEradicator, null ) } ),
				nfeContainer
			);
			clearInterval(eradicateRetry);
		} ).catch( handleError );
	} catch ( e ) {
		handleError( e );
	}
}, 1000);
