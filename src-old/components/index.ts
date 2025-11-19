import QuoteDisplay from './quote-display';
import { Store } from '../store';
import { h } from 'snabbdom/h';
import { ActionType } from '../store/action-types';

const NewsFeedEradicator = (store: Store) => {
	const state = store.getState();

	// TODO: Add quotes component
	const quoteDisplay = state.settings?.showQuotes ? QuoteDisplay(store) : null;

	const footerText = 'News Feed Eradicator';

	const onShowInfoPanel = () => {
		store.dispatch({ type: ActionType.UI_OPTIONS_SHOW });
	};

	const link = h('a.nfe-info-link', { on: { click: onShowInfoPanel } }, [
		h('span', footerText),
	]);

	// Entire app component
	return h('div', [quoteDisplay, link]);
};

export default NewsFeedEradicator;
