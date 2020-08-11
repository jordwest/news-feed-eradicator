import { h } from 'snabbdom/h';
import {
	ActionType,
	ActionObject,
	UiOptionsQuoteTabShow,
} from '../store/action-types';
import { Store } from '../store';
import { QuoteEditor } from './quote-editor';
import { BackgroundActionType } from '../background/store/action-types';
import { BuiltinQuotes, BuiltinQuote, CustomQuote } from '../quote';
import { startEditing } from '../store/actions';
import { VNode } from 'snabbdom/vnode';

const CheckboxField = (
	store: Store,
	checked: boolean,
	text: string,
	toggleAction: ActionObject,
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
				change: () => store.dispatch(toggleAction),
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
		{
			type: ActionType.BACKGROUND_ACTION,
			action: {
				type: BackgroundActionType.QUOTES_SHOW_TOGGLE,
			},
		}
	);

	const fieldShowBuiltin = CheckboxField(
		store,
		state.settings.builtinQuotesEnabled,
		'Enable Built-in Quotes',
		{
			type: ActionType.BACKGROUND_ACTION,
			action: {
				type: BackgroundActionType.QUOTES_BUILTIN_TOGGLE,
			},
		},
		!state.settings.showQuotes
	);

	const Tab = (label: string, id: UiOptionsQuoteTabShow['tab']) =>
		h(
			id === state.uiOptions.quotesTab
				? 'a.col-fg.strong'
				: 'a.underline-hover.col-fg',
			{
				props: { href: 'javascript:;' },
				on: {
					click: () => {
						store.dispatch({
							type: ActionType.UI_OPTIONS_QUOTE_TAB_SHOW,
							tab: id,
						});
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
		const onClickAddQuote = () => store.dispatch(startEditing());
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
		store.dispatch({
			type: ActionType.BACKGROUND_ACTION,
			action: {
				type: hidden
					? BackgroundActionType.QUOTE_SHOW
					: BackgroundActionType.QUOTE_HIDE,
				id,
			},
		});
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
		store.dispatch({
			type: ActionType.BACKGROUND_ACTION,
			action: {
				type: BackgroundActionType.QUOTE_DELETE,
				id,
			},
		});
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
