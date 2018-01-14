import {h} from 'snabbdom/h';

import {Store} from '../store';
import {
    setQuoteText,
    setQuoteSource,
    addQuote,
    cancelEditing,
} from '../store/actions';

const QuoteEditor = (store: Store) => {

    const state = store.getState();

    const text = state.editingText;
    const source = state.editingSource;

    const onChangeText = e => {
        store.dispatch(setQuoteText(e.target.value));
    }
    const onChangeSource = e => {
        store.dispatch(setQuoteSource(e.target.value));
    }

    const onSave = () => {
        store.dispatch(addQuote(text, source));
        store.dispatch(cancelEditing());
    }
    const onCancel = () => {
        store.dispatch(cancelEditing());
    }

    return h('div', [
        h('p.nfe-quote-text', [
            h('textarea.nfe-editor-quote', {props: {
                placeholder: 'Quote',
                value: text,
                autoFocus: true
            }, on: {
                change: onChangeText
            }})
        ]),
        h('p.nfe-quote-source', [
            h('span', '~ '),
            h('input.nfe-editor-source', {props: {
                type: 'text',
                placeholder: 'Source',
                value: source
            }, on: {
                change: onChangeSource
            }})
        ]),
        h('div', [
            h('button.nfe-button', {on: {click: onCancel}}, 'Cancel'),
            h('button.nfe-button.nfe-button-primary', {on: {click: onSave}}, 'Save')
        ])
    ])
}

export default QuoteEditor;