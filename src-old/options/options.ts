import { createStore } from '../store/index';
import './options.css';
import { init } from 'snabbdom';
import { h } from 'snabbdom/h';
import propsModule from 'snabbdom/modules/props';
import attrsModule from 'snabbdom/modules/attributes';
import eventsModule from 'snabbdom/modules/eventlisteners';
import { toVNode } from 'snabbdom/tovnode';
import InfoPanel from '../components/info-panel';
import { ActionType } from '../store/action-types';
import { BackgroundActionType } from '../background/store/action-types';
import { SECOND } from '../lib/time';

const store = createStore();

export function start(container: Node | null) {
	if (container == null) {
		throw new Error('Root element not found');
	}

	var nfeContainer = document.createElement('div');
	nfeContainer.id = 'options-container';
	container.appendChild(nfeContainer);

	const patch = init([propsModule, attrsModule, eventsModule]);

	let vnode = toVNode(nfeContainer);

	store.dispatch({
		type: ActionType.BACKGROUND_ACTION,
		action: {
			type: BackgroundActionType.FEATURE_INCREMENT,
		},
	});

	const render = () => {
		const newVnode = h('div#options-container', [InfoPanel(store)]);

		patch(vnode, newVnode);
		vnode = newVnode;
	};
	store.subscribe(render);

	// We need to force re-render when time remaining is shown
	setInterval(() => {
		const state = store.getState();
		if (state.uiOptions.tab === 'sites') render();
	}, 30 * SECOND);

	render();
}

start(document.getElementById('app'));
