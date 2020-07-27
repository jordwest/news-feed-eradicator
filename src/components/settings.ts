import { h } from 'snabbdom/h';
import { ActionType, ActionObject } from '../store/action-types';
import { Store } from '../store';
import { SettingsActionType } from '../settings/action-types';

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
		h('span', text),
	]);
};

const Settings = (store: Store) => {
	let state = store.getState();
	if (state.settings == null) {
			return null;
	}

	const fieldShowQuotes = CheckboxField(
		store,
		state.settings.showQuotes,
		'Show Quotes',
		{
			type: ActionType.SETTINGS_ACTION,
			action: {
				type: SettingsActionType.QUOTES_SHOW_TOGGLE,
			},
		}
	);

	const fieldShowBuiltin = CheckboxField(
		store,
		state.settings.builtinQuotesEnabled,
		'Enable Built-in Quotes',
		{
			type: ActionType.SETTINGS_ACTION,
			action: {
				type: SettingsActionType.QUOTES_BUILTIN_TOGGLE,
			},
		},
		!state.settings.showQuotes
	);

	const hiddenQuoteCount = state.settings?.hiddenBuiltinQuotes.length;
	const hiddenQuoteReset = (e: Event) => {
		e.preventDefault();
		store.dispatch({
			type: ActionType.SETTINGS_ACTION,
			action: {
				type: SettingsActionType.QUOTE_HIDDEN_RESET,
			},
		});
	};
	const hiddenQuotes = h('span.nfe-settings-hidden-quote-count', [
		h('span', ' ' + hiddenQuoteCount + ' hidden - '),
		h('a', { props: { href: '#' }, on: { click: hiddenQuoteReset } }, 'Reset'),
	]);

	const customQuotes = () => {
		if (state.settings!.customQuotes.length > 0) {
			return h('label', state.settings!.customQuotes.length + ' custom quotes');
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
