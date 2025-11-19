import { h } from 'snabbdom/h';
import { currentQuote } from '../store/selectors';
import {
	removeCurrentQuote,
	selectNewQuote,
	menuHide,
	menuToggle,
	showOptions,
} from '../store/actions';
import { Store } from '../store';
import { ActionObject } from '../store/action-types';

const MenuItem = (store: Store, action: ActionObject, children: string) => {
	const onClick = (e: Event) => {
		e.preventDefault();
		store.dispatch(menuHide());
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
			MenuItem(store, removeCurrentQuote(), 'Remove this quote'),
			MenuItem(store, selectNewQuote(), 'See another quote'),
			MenuItem(store, showOptions(), 'Settings...'),
		]),
	]);
};

const QuoteDisplay = (store: Store) => {
	const state = store.getState();
	const quote = currentQuote(state);

	if (quote == null) return null;

	const toggleMenu = (e: MouseEvent) => {
		e.preventDefault();
		store.dispatch(menuToggle());
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
