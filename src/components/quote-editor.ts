import {h} from 'snabbdom/h';

import {Store} from '../store';
import {
    setQuoteText,
    setQuoteSource,
    addQuote,
    cancelEditing,
    toggleBulkEdit,
    addQuotesBulk
} from '../store/actions';

const QuoteEditor = (store: Store) => {

    const state = store.getState();

    const text = state.editingText;
    const source = state.editingSource;

    const isEditingBulk = state.isEditingBulk;

    const onChangeText = e => {
        store.dispatch(setQuoteText(e.target.value));
    }
    const onChangeSource = e => {
        store.dispatch(setQuoteSource(e.target.value));
    }

    const onSave = () => {
        if (!isEditingBulk) {
            store.dispatch(addQuote(text, source));
        } else {
            store.dispatch(addQuotesBulk(text));
        }
        store.dispatch(cancelEditing());
    }
    const onCancel = () => {
        store.dispatch(cancelEditing());
    }
    const onCheckboxToggle = (e) => {
        store.dispatch(toggleBulkEdit());
    }

    const quoteEditor = h('p.nfe-quote-text', [
        h('textarea.nfe-editor-quote', {props: {
            placeholder: 'Quote',
            value: text,
            autoFocus: true,
        }, on: {
            change: onChangeText
        }})
    ]);
    const quoteEditorBulk = h('p.nfe-quote-text', [
        h('textarea.nfe-editor-quote-bulk', {props: {
            placeholder: 'Bulk add quotes: a "~" should separate a quote\'s text and source, '
                       + 'and quotes should be separated by newlines. Quotation marks are '
                       + 'unnecessary. Below are sample quotes:\n\n'
                       + 'Remember to separate quotes with a newline (enter key)! It\'s okay for '
                       + 'longer quotes to wrap around the box ~ the devs\n'
                       + 'Spacing around the tilde doesn\'t matter.~the devs\n'
                       + 'Report any bugs on github!  ~the devs',
            value: text,
            autoFocus: true,
        }, on: {
            change: onChangeText
        }})
    ]);
    const sourceEditor = h('p.nfe-quote-source', [
        h('span', '~ '),
        h('input.nfe-editor-source', {props: {
            type: 'text',
            placeholder: 'Source',
            value: source
        }, on: {
            change: onChangeSource
        }})
    ]);
    const buttons = h('div', [
        h('button.nfe-button', {on: {click: onCancel}}, 'Cancel'),
        h('button.nfe-button.nfe-button-primary', {on: {click: onSave}}, 'Save'),
        h('label.nfe-label.nfe-label-add-bulk', [
            h('input.nfe-checkbox', {props: {
                type: 'checkbox',
                checked: isEditingBulk
            }, on: {
                change: onCheckboxToggle
            }}),
            'Add multiple quotes'
        ]),
    ]);

    if (isEditingBulk) {
        return h('div', [quoteEditorBulk, buttons]);
    }

    return h('div', [quoteEditor, sourceEditor, buttons]);
}

export default QuoteEditor;