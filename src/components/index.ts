import QuoteDisplay from './quote-display';
import { Store } from '../store';
import { h } from 'snabbdom/h';
import { uiOptionsShow } from '../store/slices';

const NewsFeedEradicator = (store: Store) => {
	const state = store.getState();

	// TODO: Add quotes component
	const quoteDisplay = state.settings?.showQuotes ? QuoteDisplay(store) : null;

	const footerText = 'News Feed Eradicator';

	const onShowInfoPanel = () => {
		store.dispatch(uiOptionsShow());
	};

	const link = h('a.nfe-info-link', { on: { click: onShowInfoPanel } }, [
		h('span', footerText),
	]);

	// Entire app component
	return h('div', [quoteDisplay, link]);
};

export default NewsFeedEradicator;
