import { h } from 'snabbdom/h';

import {
	toggleShowQuotes,
	resetHiddenQuotes,
	toggleBuiltinQuotes,
} from '../store/actions';
import { Store } from '../store';

const CheckboxField = (
	store: Store,
	checked: boolean,
	text: string,
	toggleAction,
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
		h('span', text),
	]);
};

const Settings = (store: Store) => {
	let state = store.getState();

	const fieldShowQuotes = CheckboxField(
		store,
		state.showQuotes,
		'Show Quotes',
		toggleShowQuotes()
	);

	const fieldShowBuiltin = CheckboxField(
		store,
		state.builtinQuotesEnabled,
		'Enable Built-in Quotes',
		toggleBuiltinQuotes(),
		!state.showQuotes
	);

	const hiddenQuoteCount = state.hiddenBuiltinQuotes.length;
	const hiddenQuoteReset = e => {
		e.preventDefault();
		store.dispatch(resetHiddenQuotes());
	};
	const hiddenQuotes = h('span.nfe-settings-hidden-quote-count', [
		h('span', ' ' + hiddenQuoteCount + ' hidden - '),
		h('a', { props: { href: '#' }, on: { click: hiddenQuoteReset } }, 'Reset'),
	]);

	const customQuotes = () => {
		if (state.customQuotes.length > 0) {
			return h('label', state.customQuotes.length + ' custom quotes');
		}
		return h(
			'label',
			'You can now add your own custom quotes! ' +
				'Just click the arrow menu beside the quote text.'
		);
	};

	return h('form.nfe-settings', [
		h('fieldset', [
			h('legend', [fieldShowQuotes]),
			fieldShowBuiltin,
			hiddenQuoteCount > 0 ? hiddenQuotes : null,
			h('p', [customQuotes()]),
		]),
	]);
};

export default Settings;
