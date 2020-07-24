import { IState } from './reducer';
import config from '../config';

import Quote, { BuiltinQuotes } from '../quote';

export function areNewFeaturesAvailable(state: IState) {
	return config.newFeatureIncrement > state.featureIncrement;
}

export function getBuiltinQuotes(state: IState) {
	if (!state.builtinQuotesEnabled) return [];
	return BuiltinQuotes.filter(
		quote =>
			typeof quote.id !== 'number' ||
			state.hiddenBuiltinQuotes.indexOf(quote.id) === -1
	);
}

export function currentQuote(state: IState): Quote {
	const emptyQuote = { id: null, text: 'No quotes found!', source: '' };

	if (state.currentQuoteID == null) return emptyQuote;

	if (state.isCurrentQuoteCustom) {
		return (
			state.customQuotes.find(quote => quote.id === state.currentQuoteID) ||
			emptyQuote
		);
	} else {
		return (
			BuiltinQuotes.find(quote => quote.id === state.currentQuoteID) ||
			emptyQuote
		);
	}
}
