
import { IState } from './reducer';
import config from '../config';

import Quote, { BuiltinQuotes } from '../quote';

export function areNewFeaturesAvailable( state: IState ) {
	return ( config.newFeatureIncrement > state.featureIncrement );
}

export function currentQuote( state: IState ) : Quote {
	const emptyQuote = { id: null, text: "?", source: null };

	if ( ! state.currentQuoteID ) return emptyQuote;

	if( ! state.isCurrentQuoteCustom ) {
		return BuiltinQuotes.find( quote => quote.id === state.currentQuoteID ) || emptyQuote;
	}

	return emptyQuote;
}
