import handleError from './lib/handle-error';
import { createStore } from './store/index';
import './options.css';
import { init } from 'snabbdom';
import { h } from 'snabbdom/h';
import propsModule from 'snabbdom/modules/props';
import attrsModule from 'snabbdom/modules/attributes';
import eventsModule from 'snabbdom/modules/eventlisteners';
import { toVNode } from 'snabbdom/tovnode';
import InfoPanel from './components/info-panel';

const storePromise = createStore();

export function start(container: Node) {
	var nfeContainer = document.createElement('div');
	nfeContainer.id = 'nfe-container';
	container.appendChild(nfeContainer);

	const patch = init([propsModule, attrsModule, eventsModule]);

	let vnode = toVNode(nfeContainer);

	storePromise
		.then(store => {
			const render = () => {
				const newVnode = h('div#nfe-container', [InfoPanel(store)]);

				patch(vnode, newVnode);
				vnode = newVnode;
			};

			render();
			store.subscribe(render);
		})
		.catch(handleError);
}

start(document.getElementById('app'));
