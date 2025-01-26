import { h } from 'snabbdom/h';
import { currentQuote } from '../store/selectors';
import {
	quoteRemoveCurrent,
	selectNewQuote,
	hideMenu,
	toggleMenu as toggleMenuAction,
	uiOptionsShow,
} from '../store/slices';
import { Store } from '../store';
import { UnknownAction } from '@reduxjs/toolkit';

const MenuItem = (store: Store, action: UnknownAction, children: string) => {
	const onClick = (e: Event) => {
		e.preventDefault();
		store.dispatch(hideMenu());
		store.dispatch(action);
	};

	return h('li.margin-0.pad-0', [
		h(
			'a.nfe-quote-action-menu-item.underline-off',
			{ props: { href: '#' }, on: { click: onClick } },
			children
		),
	]);
};

const QuoteMenu = (store: Store) => {
	return h('div.nfe-quote-action-menu-content', [
		h('ul.margin-0.pad-0.list-unstyled', [
			MenuItem(store, quoteRemoveCurrent(), 'Remove this quote'),
			MenuItem(store, selectNewQuote(), 'See another quote'),
			MenuItem(store, uiOptionsShow(), 'Settings...'),
		]),
	]);
};

const QuoteDisplay = (store: Store) => {
	const state = store.getState();
	const quote = currentQuote(state);

	if (quote == null) return null;

	const toggleMenu = (e: MouseEvent) => {
		e.preventDefault();
		store.dispatch(toggleMenuAction());
	};
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
