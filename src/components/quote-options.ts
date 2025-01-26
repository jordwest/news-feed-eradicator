import { h } from 'snabbdom/h';
import { Store } from '../store';
import { QuoteEditor } from './quote-editor';
import { BuiltinQuotes, BuiltinQuote, CustomQuote } from '../quote';
import { backgroundAction, OptionsState, startEditText, uiOptionsQuoteTabShow } from '../store/slices';
import { VNode } from 'snabbdom/vnode';
import { UnknownAction } from '@reduxjs/toolkit';
import { hideHiddenBuiltinQuote, removeCustomQuote, showHiddenBuiltinQuote, toggleBuiltinQuotesEnabled, toggleShowQuotes } from '../background/store/slices';

const CheckboxField = (
	store: Store,
	checked: boolean,
	text: string,
	toggleAction: UnknownAction,
	disabled = false
) => {
	return h('label', [
		h('input', {
			props: {
				type: 'checkbox',
				checked,
				disabled,
			},
			on: {
				change: () => store.dispatch(toggleAction),  // ? should toggleAction be toggleAction()
			},
		}),
		h('span', ' ' + text),
	]);
};

const QuoteOptions = (store: Store) => {
	let state = store.getState();
	if (state.settings == null) {
		return null;
	}

	const fieldShowQuotes = CheckboxField(
		store,
		state.settings.showQuotes,
		'Show Quotes',
		backgroundAction(toggleShowQuotes())
	);

	const fieldShowBuiltin = CheckboxField(
		store,
		state.settings.builtinQuotesEnabled,
		'Enable Built-in Quotes',
		backgroundAction(toggleBuiltinQuotesEnabled()),
		!state.settings.showQuotes
	);

	const Tab = (label: string, id: OptionsState['quotesTab']) =>
		h(
			id === state.uiOptions.quotesTab
				? 'a.col-fg.strong'
				: 'a.underline-hover.col-fg',
			{
				props: { href: 'javascript:;' },
				on: {
					click: () => {
						store.dispatch(uiOptionsQuoteTabShow(id));
					},
				},
			},
			label
		);

	let quoteTable: VNode;
	if (state.isEditingQuote) {
		// Instead of quote table, show the quote editor
		quoteTable = h('div.pad-2.bg-3.shadow', QuoteEditor(store));
	} else {
		const onClickAddQuote = () => store.dispatch(startEditText());
		quoteTable = h('div.v-stack', [
			h('div.flex.justify-center.h-stack-2', [
				Tab('Custom quotes', 'custom'),
				state.settings.builtinQuotesEnabled
					? Tab('Built-in Quotes', 'builtin')
					: null,
			]),
			h(
				'div',
				state.uiOptions.quotesTab === 'custom'
					? CustomQuoteTable(store)
					: BuiltinQuoteTable(store)
			),
			h('button', { on: { click: onClickAddQuote } }, 'Add a new quote'),
		]);
	}

	return h('div.nfe-settings', [
		h('div.v-stack-2', [
			h('h2', 'Quotes'),
			h('div.v-stack', [
				h('div', fieldShowQuotes),
				state.settings.showQuotes ? h('div', fieldShowBuiltin) : null,
			]),
			state.settings.showQuotes ? quoteTable : null,
		]),
	]);
};

const BuiltinQuoteTable = (store: Store) => {
	let state = store.getState();
	if (state.settings == null) {
		return null;
	}

	const showHideQuote = (id: number, hidden: boolean) => () => {
		store.dispatch(backgroundAction(
			hidden 
				? showHiddenBuiltinQuote (id)
				: hideHiddenBuiltinQuote (id)
		))
	};
	const BuiltinQuote = (quote: BuiltinQuote) => {
		const isHidden =
			state.settings?.hiddenBuiltinQuotes.indexOf(quote.id) !== -1;
		return (
			quote &&
			h('tr', [
				h(
					isHidden ? 'td.pad-1.text-muted.text-strike' : 'td.pad-1',
					quote.text
				),
				h(
					isHidden ? 'td.pad-1.text-muted.text-strike' : 'td.pad-1',
					quote.source
				),
				h('td', [
					h(
						'a.underline-hover',
						{
							props: { href: 'javascript:;' },
							on: { click: showHideQuote(quote.id, isHidden) },
						},
						isHidden ? 'Enable' : 'Disable'
					),
				]),
			])
		);
	};

	return h('table.border.scrollable-table', [
		h('thead', [
			h('tr', [
				h('th.pad-1', 'Quote'),
				h('th.pad-1', 'Source'),
				h('th.pad-1', ''),
			]),
		]),
		h('tbody', [...BuiltinQuotes.sort(quoteCompare).map(BuiltinQuote)]),
	]);
};

const CustomQuoteTable = (store: Store) => {
	let state = store.getState();
	if (state.settings == null) {
		return null;
	}

	const deleteQuote = (id: string) => () => {
		store.dispatch(backgroundAction(removeCustomQuote(id)))
	};
	const CustomQuote = (quote: CustomQuote) => {
		return (
			quote &&
			h('tr', [
				h('td.pad-1', quote.text),
				h('td.pad-1', quote.source),
				h('td.pad-1', [
					h(
						'a.underline-hover',
						{
							props: { href: 'javascript:;' },
							on: { click: deleteQuote(quote.id) },
						},
						'Delete'
					),
				]),
			])
		);
	};

	return h('table.border.scrollable-table', [
		h('thead', [
			h('tr', [
				h('th.pad-1', 'Quote'),
				h('th.pad-1', 'Source'),
				h('th.pad-1', ''),
			]),
		]),
		h('tbody', [
			...state.settings.customQuotes.sort(quoteCompare).map(CustomQuote),
			state.settings.customQuotes.length === 0
				? h('tr', [h('td.pad-1', 'No custom quotes added'), h('td'), h('td')])
				: null,
		]),
	]);
};

const quoteCompare = <T extends { source: string }>(a: T, b: T): number => {
	if (a.source < b.source) return -1;
	if (a.source > b.source) return 1;
	return 0;
};

export default QuoteOptions;
