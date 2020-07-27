import handleError from './handle-error';
import { createStore } from '../store/index';
import NewsFeedEradicator from '../components/index';

import { init } from 'snabbdom';
import { h } from 'snabbdom/h';
import propsModule from 'snabbdom/modules/props';
import attrsModule from 'snabbdom/modules/attributes';
import eventsModule from 'snabbdom/modules/eventlisteners';
import { toVNode } from 'snabbdom/tovnode';

const store = createStore();

export function isAlreadyInjected() {
	return document.querySelector('#nfe-container') != null;
}

export default function injectUI(streamContainer: Node) {
	console.log('injecing ui');
	var nfeContainer = document.createElement('div');
	nfeContainer.id = 'nfe-container';
	streamContainer.appendChild(nfeContainer);

	const patch = init([propsModule, attrsModule, eventsModule]);

	let vnode = toVNode(nfeContainer);

	const render = () => {
		const newVnode = h('div#nfe-container', [NewsFeedEradicator(store)]);

		patch(vnode, newVnode);
		vnode = newVnode;
	};

	render();
	store.subscribe(render);
}
