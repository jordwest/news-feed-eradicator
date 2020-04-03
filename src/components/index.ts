import QuoteDisplay from './quote-display';
import InfoPanel from './info-panel';

import { Store } from '../store';
import { showInfoPanel } from '../store/actions';
import { areNewFeaturesAvailable } from '../store/selectors';

import { h } from 'snabbdom/h';

const NewsFeedEradicator = (store: Store) => {
	const state = store.getState();

	// TODO: Add quotes component
	const quoteDisplay = state.showQuotes ? QuoteDisplay(store) : null;

	const newFeatureLabel = areNewFeaturesAvailable(state)
		? h('span.nfe-label.nfe-new-features', 'New Features!')
		: null;

	const infoPanel = state.showInfoPanel ? InfoPanel(store) : null;

	const onShowInfoPanel = () => store.dispatch(showInfoPanel());
	const link = h('a.nfe-info-link', { on: { click: onShowInfoPanel } }, [
		h('span', 'News Feed Eradicator'),
		newFeatureLabel,
	]);

	// Entire app component
	return h('div', [infoPanel, quoteDisplay, link]);
};

export default NewsFeedEradicator;
