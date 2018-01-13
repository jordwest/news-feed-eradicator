import * as React from 'react';
import * as ReactDOM from 'react-dom';

import handleError from './handle-error';
import { Provider } from 'react-redux';
import { createStore } from '../store';
import NewsFeedEradicator from '../components/index';

const storePromise = createStore();

export function isAlreadyInjected() {
	return document.querySelector( '#nfe-container' ) != null;
}

export default function injectUI( streamContainer: Element ) {
	var nfeContainer = document.createElement("div");
	nfeContainer.id = "nfe-container";
	streamContainer.appendChild(nfeContainer);

	storePromise.then( ( store ) => {
		ReactDOM.render(
			React.createElement( Provider, {
				store: store,
				children: React.createElement( NewsFeedEradicator, null )
			} ),
			nfeContainer
		);
	} ).catch( handleError );
}
