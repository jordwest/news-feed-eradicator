import { Effect } from '../lib/redux-effects';
import { IState } from './reducer';
import { getBuiltinQuotes } from './selectors';
import { ActionType, ActionObject } from './action-types';
import { cancelEditing, addQuote } from './actions';
import { generateID } from '../lib/generate-id';

type AppEffect = Effect<IState, ActionObject>;

// When certain UI events happen, we need to select a new quote
const refreshQuotes: AppEffect = store => action => {
	if (action.type === ActionType.TOGGLE_SHOW_QUOTES) {
		store.dispatch({ type: ActionType.SELECT_NEW_QUOTE });
	}
};

// Find a new quote from the database
const selectNewQuote: AppEffect = store => action => {
	if (action.type === ActionType.SELECT_NEW_QUOTE) {
		const state = store.getState();
		const builtinQuotes = getBuiltinQuotes(state);
		const customQuotes = state.customQuotes;
		const allQuotes = builtinQuotes.concat(customQuotes);
		if (allQuotes.length < 1) {
			return store.dispatch({
				type: ActionType.QUOTE_SET,
				isCustom: false,
				id: null,
			});
		}

		const quoteIndex = Math.floor(Math.random() * allQuotes.length);
		store.dispatch({
			type: ActionType.QUOTE_SET,
			isCustom: quoteIndex >= builtinQuotes.length,
			id: allQuotes[quoteIndex].id,
		});
	}
};

// When quote is added, we can cancel editing
const quoteSaveClicked: AppEffect = store => action => {
	console.log('im an effect', action);
	const state = store.getState();

	if (action.type === ActionType.QUOTE_SAVE_CLICKED) {
		console.log('adding quote', state.editingText, state.editingSource);
		store.dispatch(addQuote(state.editingText, state.editingSource));
		console.log('quote added', action);
		store.dispatch(cancelEditing());
	}
};

const quoteRemoveCurrent: AppEffect = store => action => {
	if (action.type !== ActionType.QUOTE_REMOVE_CURRENT) return;

	const state: IState = store.getState();
	if (state.isCurrentQuoteCustom) {
		store.dispatch({
			type: ActionType.QUOTE_DELETE,
			id: state.currentQuoteID,
		});
	} else {
		store.dispatch({
			type: ActionType.QUOTE_HIDE,
			id: state.currentQuoteID,
		});
	}

	store.dispatch({ type: ActionType.SELECT_NEW_QUOTE });
};

const quoteAddBulk: AppEffect = store => action => {
	if (action.type !== ActionType.QUOTE_ADD_BULK) return;

	const lines = action.text.split('\n');
	const quotes = [];
	for (var lineCount = 0; lineCount < lines.length; lineCount++) {
		const line = lines[lineCount];
		const quote = line.split('~');
		const trimmedQuote = [];

		if (quote.length === 0 || quote[0].trim() === '') {
			// ignore newlines and empty spaces
		} else if (quote.length !== 2) {
			return store.dispatch({
				type: ActionType.PARSE_ERROR,
				message: `Invalid format on line ${(
					lineCount + 1
				).toString()}: \"${quote}\"`,
			});
		} else {
			quote.forEach(field => trimmedQuote.push(field.trim()));
			quotes.push(trimmedQuote);
		}
	}
	quotes.forEach(trimmedQuote => {
		store.dispatch({
			type: ActionType.QUOTE_ADD,
			id: generateID(),
			text: trimmedQuote[0],
			source: trimmedQuote[1],
		});
	});
	store.dispatch(cancelEditing());
};

export const rootEffect: AppEffect = Effect.all(
	refreshQuotes,
	selectNewQuote,
	quoteRemoveCurrent,
	quoteSaveClicked,
	quoteAddBulk
);
