import {h} from 'snabbdom/h';

import {Store} from '../store';
import {
    setQuoteText,
    addQuote,
    cancelEditing,
} from '../store/actions';

const QuoteBulkEditor = (store: Store) => {

    const state = store.getState();

    const bulkText = state.editingText;

    const onChangeText = e => {
        store.dispatch(setQuoteText(e.target.value));
    }

    const onSave = () => {
        const quotes = bulkText.split("\n");
        quotes.forEach((line) => {
            const quote = line.split("~");
            const trimmedQuote = [];
            quote.forEach((field) => trimmedQuote.push(field.trim()));

            if (trimmedQuote[0] && trimmedQuote[1]) {
                store.dispatch(addQuote(trimmedQuote[0], trimmedQuote[1]));
            }
        });
        store.dispatch(cancelEditing());
    }
    const onCancel = () => {
        store.dispatch(cancelEditing());
    }

    return h('div', [
        h('p.nfe-quote-text', [
            h('textarea.nfe-editor-quote', {props: {
                placeholder: 'Bulk add quotes: a "~" should separate a quote\'s text and source, '
                        + 'and quotes should be separated by newlines. Quotation marks are '
                        + 'unnecessary. Below are sample quotes:\n\n'
                        + 'Remember to separate quotes with a newline (enter key)! It\'s okay for '
                        + 'longer quotes to wrap around the box ~ the devs\n'
                        + 'Spacing around the tilde doesn\'t matter.~the devs\n'
                        + 'Report any bugs on github!  ~the devs',
                value: bulkText,
                autoFocus: true
            }, on: {
                change: onChangeText
            }})
        ]),
        h('div', [
            h('button.nfe-button', {on: {click: onCancel}}, 'Cancel'),
            h('button.nfe-button.nfe-button-primary', {on: {click: onSave}}, 'Save all')
        ])
    ])
}

export default QuoteBulkEditor;