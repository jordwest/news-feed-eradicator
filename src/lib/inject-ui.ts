import { Store } from '../store/index';
import NewsFeedEradicator from '../components/index';
import { init } from 'snabbdom';
import { h } from 'snabbdom/h';
import propsModule from 'snabbdom/modules/props';
import attrsModule from 'snabbdom/modules/attributes';
import eventsModule from 'snabbdom/modules/eventlisteners';
import { toVNode } from 'snabbdom/tovnode';

export function isAlreadyInjected() {
	return document.querySelector('#nfe-container') != null;
}

const rgbRe = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/;

/**
 * Inject the News Feed Eradicator panel into the page.
 */
export default function injectUI(streamContainer: Node, store: Store, asFirstChild = false) {
	const nfeContainer = document.createElement('div');
	nfeContainer.id = 'nfe-container';
	if (asFirstChild && streamContainer.firstChild) {
		streamContainer.insertBefore(nfeContainer, streamContainer.firstChild);
	} else {
		streamContainer.appendChild(nfeContainer);
	}

	const patch = init([propsModule, attrsModule, eventsModule]);

	let vnode = toVNode(nfeContainer);

	const render = () => {
		const newVnode = h('div#nfe-container', [NewsFeedEradicator(store)]);

		patch(vnode, newVnode);
		vnode = newVnode;

		const col = window.getComputedStyle(document.body)['background-color'];
		const match = rgbRe.exec(col);
		if (match) {
			const r = parseInt(match[1], 10);
			const g = parseInt(match[2], 10);
			const b = parseInt(match[3], 10);
			// Check the background color
			let mode: string;
			if (r < 100 && g < 100 && b < 100) {
				mode = 'dark';
			} else {
				mode = 'light';
			}
			document.body.dataset.nfeColorScheme = mode;
		}
	};

	render();
	store.subscribe(render);
}
