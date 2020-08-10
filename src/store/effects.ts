import { Effect } from '../lib/redux-effects';
import { IState } from './reducer';
import { currentQuote, getAvailableQuotes } from './selectors';
import { ActionType, ActionObject } from './action-types';
import { cancelEditing, addQuote } from './actions';
import { generateID } from '../lib/generate-id';
import { getBrowser } from '../webextension';
import { Message, MessageType } from '../messaging/types';
import { SettingsActionType } from '../background/store/action-types';
import { Sites } from '../sites';

export type AppEffect = Effect<IState, ActionObject>;

// When the settings have changed, we might need to select a new quote
const refreshQuotes: AppEffect = (store) => (action) => {
	if (action.type === ActionType.SETTINGS_CHANGED) {
		// Check if current quote still exists
		const state = store.getState();
		const current = currentQuote(state);
		if (current == null) {
			store.dispatch({ type: ActionType.SELECT_NEW_QUOTE });
		}
	}
};

// Find a new quote from the database
const selectNewQuote: AppEffect = (store) => (action) => {
	if (action.type === ActionType.SELECT_NEW_QUOTE) {
		const state = store.getState();
		if (state.settings == null) {
			throw new Error('Settings not available yet');
		}

		const allQuotes = getAvailableQuotes(state);
		if (allQuotes.length < 1) {
			return store.dispatch({
				type: ActionType.QUOTE_CURRENT_SET,
				quote: { type: 'none-found' },
			});
		}

		const quoteIndex = Math.floor(Math.random() * allQuotes.length);
		store.dispatch({
			type: ActionType.QUOTE_CURRENT_SET,
			quote: allQuotes[quoteIndex],
		});
	}
};

// When quote is added, we can cancel editing
const quoteSaveClicked: AppEffect = (store) => (action) => {
	const state = store.getState();

	if (action.type === ActionType.QUOTE_SAVE_CLICKED) {
		// Don't do anything if quote is empty
		if (state.editingText.trim().length < 1) {
			return;
		}

		const id = generateID();
		store.dispatch(addQuote(id, state.editingText, state.editingSource));
		store.dispatch(cancelEditing());
		store.dispatch({
			type: ActionType.QUOTE_CURRENT_SET,
			quote: { type: 'custom', id },
		});
	}
};

const quoteRemoveCurrent: AppEffect = (store) => (action) => {
	if (action.type !== ActionType.QUOTE_REMOVE_CURRENT) return;

	const state: IState = store.getState();
	if (state.currentQuote == null || state.currentQuote.type === 'none-found') {
		return;
	} else if (state.currentQuote.type === 'custom') {
		store.dispatch({
			type: ActionType.SETTINGS_ACTION,
			action: {
				type: SettingsActionType.QUOTE_DELETE,
				id: state.currentQuote.id,
			},
		});
	} else {
		store.dispatch({
			type: ActionType.SETTINGS_ACTION,
			action: {
				type: SettingsActionType.QUOTE_HIDE,
				id: state.currentQuote.id,
			},
		});
	}

	store.dispatch({ type: ActionType.SELECT_NEW_QUOTE });
};

const quoteAddBulk: AppEffect = (store) => (action) => {
	if (action.type !== ActionType.QUOTE_ADD_BULK) return;

	const lines = action.text.split('\n');
	const quotes: string[][] = [];
	for (var lineCount = 0; lineCount < lines.length; lineCount++) {
		const line = lines[lineCount];
		const quote = line.split('~');
		const trimmedQuote: string[] = [];

		if (quote.length === 0 || quote[0].trim() === '') {
			// ignore newlines and empty spaces
		} else if (quote.length !== 2) {
			return store.dispatch({
				type: ActionType.PARSE_ERROR,
				message: `Invalid format on line ${(
					lineCount + 1
				).toString()}: \"${quote}\". Check that you have a "~" separating the quote text and the source.`,
			});
		} else {
			quote.forEach((field) => trimmedQuote.push(field.trim()));
			quotes.push(trimmedQuote);
		}
	}
	quotes.forEach((trimmedQuote) =>
		store.dispatch(addQuote(generateID(), trimmedQuote[0], trimmedQuote[1]))
	);
	store.dispatch(cancelEditing());
};

const requestPermissions: AppEffect = (store) => async (action) => {
	if (action.type === ActionType.UI_SITES_ENABLED_REQUEST_PERMISSIONS) {
		const site = Sites[action.site];
		const success = await getBrowser().permissions.request({
			permissions: [],
			origins: site.origins,
		});
		if (success) {
			// Check and update permissions
			store.dispatch({
				type: ActionType.SETTINGS_ACTION,
				action: { type: SettingsActionType.SITES_ENABLED_CHECK },
			});
		}
	}
};

const removePermissions: AppEffect = (store) => async (action) => {
	if (action.type === ActionType.UI_SITES_ENABLED_REMOVE_PERMISSIONS) {
		const site = Sites[action.site];
		const success = await getBrowser().permissions.remove({
			permissions: [],
			origins: site.origins,
		});
		if (success) {
			// Check and update permissions
			store.dispatch({
				type: ActionType.SETTINGS_ACTION,
				action: { type: SettingsActionType.SITES_ENABLED_CHECK },
			});
		}
	}
};

// Connect to the background script at startup
const connect: AppEffect = (store) => {
	const browser = getBrowser();
	const port = browser.runtime.connect();
	port.onMessage.addListener((msg: Message) => {
		if (msg.t === MessageType.SETTINGS_CHANGED) {
			store.dispatch({
				type: ActionType.SETTINGS_CHANGED,
				settings: msg.settings,
			});
		}
	});

	return (action) => {
		// Forward any actions to the background script
		if (action.type === ActionType.SETTINGS_ACTION) {
			port.postMessage({
				t: MessageType.SETTINGS_ACTION,
				action: action.action,
			});
		} else if (action.type === ActionType.UI_OPTIONS_SHOW) {
			port.postMessage({
				t: MessageType.OPTIONS_PAGE_OPEN,
			});
		}
	};
};

export const rootEffect: AppEffect = Effect.all(
	refreshQuotes,
	selectNewQuote,
	quoteRemoveCurrent,
	quoteSaveClicked,
	quoteAddBulk,
	requestPermissions,
	removePermissions,
	connect
);
