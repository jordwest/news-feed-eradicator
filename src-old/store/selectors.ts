import { IState } from './reducer';
import config from '../config';

import { BuiltinQuotes, Quote } from '../quote';
import { CurrentQuote } from './action-types';

export function getBuiltinQuotes(state: IState) {
	if (state.settings == null) return [];
	if (!state.settings.builtinQuotesEnabled) return [];

	return BuiltinQuotes.filter(
		(quote) =>
			typeof quote.id !== 'number' ||
			state.settings!.hiddenBuiltinQuotes.indexOf(quote.id) === -1
	);
}

export function getAvailableQuotes(state: IState): CurrentQuote[] {
	if (state.settings == null) {
		return [];
	}
	const builtinQuotes: CurrentQuote[] = getBuiltinQuotes(state).map((q) => ({
		type: 'builtin',
		id: q.id,
	}));
	const customQuotes: CurrentQuote[] = state.settings.customQuotes.map((q) => ({
		type: 'custom',
		id: q.id,
	}));
	return builtinQuotes.concat(customQuotes);
}

export function currentQuote(state: IState): Quote | undefined {
	if (state.settings == null) return undefined;
	if (state.currentQuote == null) return undefined;
	if (state.currentQuote.type === 'none-found') return undefined;

	if (state.currentQuote.type === 'custom') {
		const currentId = state.currentQuote.id;
		return state.settings.customQuotes.find((quote) => quote.id === currentId);
	} else {
		const currentId = state.currentQuote.id;
		if (
			!state.settings.builtinQuotesEnabled ||
			state.settings.hiddenBuiltinQuotes.indexOf(currentId) >= 0
		) {
			// Current quote has been hidden
			return undefined;
		}
		return BuiltinQuotes.find((quote) => quote.id === currentId);
	}
}
