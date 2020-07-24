import { h } from 'snabbdom/h';
import { currentQuote } from '../store/selectors';
import {
	removeCurrentQuote,
	selectNewQuote,
	startEditing,
	menuHide,
	menuToggle,
} from '../store/actions';
import { Store } from '../store';

import QuoteEditor from './quote-editor';
import { ActionObject } from '../store/action-types';

const MenuItem = (store: Store, action: ActionObject, children: string) => {
	const onClick = (e: Event) => {
		e.preventDefault();
		store.dispatch(menuHide());
		store.dispatch(action);
	};

	return h('li', [
		h(
			'a.nfe-quote-action-menu-item',
			{ props: { href: '#' }, on: { click: onClick } },
			children
		),
	]);
};

const QuoteMenu = (store: Store) => {
	return h('div.nfe-quote-action-menu-content', [
		h('ul', [
			MenuItem(store, removeCurrentQuote(), 'Remove this quote'),
			MenuItem(store, selectNewQuote(), 'See another quote'),
			MenuItem(store, startEditing(), 'Enter custom quote...'),
		]),
	]);
};

const QuoteDisplay = (store: Store) => {
	const state = store.getState();
	const quote = currentQuote(state);

	if (quote == null) return null;

	if (state.isEditingQuote) {
		return h('div.nfe-quote', [QuoteEditor(store)]);
	}

	const toggleMenu = () => store.dispatch(menuToggle());
	return h('div.nfe-quote', [
		h('nfe-quote-action-menu', [
			h(
				'a.nfe-quote-action-menu-button',
				{ props: { href: '#' }, on: { click: toggleMenu } },
				'▾'
			),
			state.isQuoteMenuVisible ? QuoteMenu(store) : null,
		]),

		h('div', [
			h('p.nfe-quote-text', [
				h('span', '“'),
				h('span', quote.text),
				h('span', '”'),
			]),
			h('p.nfe-quote-source', [h('span', '~ '), h('span', quote.source)]),
		]),
	]);
};

export default QuoteDisplay;
