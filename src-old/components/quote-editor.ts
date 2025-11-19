import { h } from 'snabbdom/h';

import { Store } from '../store/index';
import {
	setQuoteText,
	setQuoteSource,
	cancelEditing,
	toggleBulkEdit,
	addQuotesBulk,
} from '../store/actions';
import { ActionType } from '../store/action-types';
import { ErrorAlert } from './alert';
import parseCsv from '../lib/parse-csv';

export const QuoteEditor = (store: Store) => {
	const state = store.getState();

	const text = state.editingText;
	const source = state.editingSource;

	const isEditingBulk = state.isEditingBulk;
	const errorMessage = state.error;

	const onChangeText = (e: Event) => {
		store.dispatch(setQuoteText((e.target as HTMLInputElement).value));
	};
	const onChangeSource = (e: Event) => {
		store.dispatch(setQuoteSource((e.target as HTMLInputElement).value));
	};

	const onSave = () => {
		if (!isEditingBulk) {
			store.dispatch({ type: ActionType.QUOTE_SAVE_CLICKED });
		} else {
			store.dispatch(addQuotesBulk(text));
		}
	};
	const onCancel = () => {
		store.dispatch(cancelEditing());
	};
	const onToggleBulkEdit = () => {
		store.dispatch(toggleBulkEdit());
	};

	const quoteEditor = h('div.v-stack', [
		h('label.inline-block.strong', 'Quote text'),
		h(
			'div',
			h('textarea.pad-1.width-100pc', {
				props: {
					placeholder:
						'Life without endeavor is like entering a jewel mine and coming out with empty hands.',
					value: text,
					rows: 5,
					autoFocus: true,
				},
				on: {
					change: onChangeText,
				},
			})
		),
	]);
	const quoteEditorBulk = h('div.v-stack', [
		h('label.inline-block.strong', 'Bulk add quotes'),
		h(
			'div',
			'Each line represents a quote, with the quote text and source separated by a tilde (~)'
		),
		h(
			'div',
			h('textarea.pad-1.width-100pc', {
				props: {
					placeholder:
						'All that we are is the result of what we have thought. ~ Buddha\n' +
						'One of the secrets to staying young is to always do things you don’t know how to do, to keep learning. ~ Ruth Reichl\n' +
						'The most common way people give up their power is by thinking they don’t have any. ~ Alice Walker',
					value: text,
					rows: 8,
					autoFocus: true,
				},
				on: {
					change: onChangeText,
				},
			})
		),
	]);

	const csvUploadListener = (e: Event) => {
		const csvFiles = (<HTMLInputElement>e.target).files;
		const csvFile = csvFiles && csvFiles[0];
		if (csvFile) {
			const reader = new FileReader();
			reader.readAsText(csvFile);
			reader.onload = () => {
				const csvText = reader.result;
				if (csvText && typeof csvText === 'string') {
					const parsedCSV = parseCsv(csvText);
					const parsedCSVFormatted = parsedCSV
						.map((item) => {
							return {
								text: item[0],
								source: item[1],
							};
						})
						.reduce((accu, curr) => {
							return accu + `${curr['text']} ~ ${curr['source'] || ''}\n`;
						}, '');
					store.dispatch(setQuoteText(parsedCSVFormatted));
				}
			};
		}
	};

	const importCSV = h('div.nfe-csv-import', [
		h('div.nfe-csv-or', 'Or, Import from a CSV'),
		h('input.nfe-csv-import-input', {
			on: {
				change: csvUploadListener,
			},
			props: {
				name: 'nfecsvimporter',
				type: 'file',
				id: 'nfe-csv-importer',
				accept:
					'.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
			},
		}),
	]);
	const sourceEditor = h('div.v-stack', [
		h('label.inline-block.strong', 'Quote source'),
		h('input.pad-1.width-100pc', {
			props: {
				type: 'text',
				placeholder: 'Japanese Proverb',
				value: source,
			},
			on: {
				change: onChangeSource,
			},
		}),
	]);
	const buttons = h('div.h-stack', [
		h('button', { on: { click: onCancel } }, 'Cancel'),
		h(
			'button.bg-active',
			{ props: { type: 'button' }, on: { click: onSave } },
			'Save'
		),
	]);
	const error = errorMessage ? ErrorAlert(errorMessage) : null;

	const Tab = (label: string, value: boolean) => {
		return isEditingBulk === value
			? h(
					'a.strong.col-fg',
					{ props: { href: 'javascript:;' }, on: { click: onToggleBulkEdit } },
					label
			  )
			: h(
					'a.underline-hover.col-fg',
					{ props: { href: 'javascript:;' }, on: { click: onToggleBulkEdit } },
					label
			  );
	};

	const tabs = h('div.flex.justify-center.h-stack-2', [
		Tab('One-by-one', false),
		Tab('Bulk add', true),
	]);
	const header = h('h3.text-center', 'Add a quote');

	if (isEditingBulk) {
		return h('div.v-stack-2', [
			header,
			tabs,
			error,
			quoteEditorBulk,
			importCSV,
			buttons,
		]);
	}

	return h('div.v-stack-2', [header, tabs, quoteEditor, sourceEditor, buttons]);
};

export default QuoteEditor;
