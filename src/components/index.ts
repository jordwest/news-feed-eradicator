import QuoteDisplay from './quote-display';

import { Store } from '../store';
import { areNewFeaturesAvailable } from '../store/selectors';

import { h } from 'snabbdom/h';
import { getBrowser } from '../webextension';
import { MessageType } from '../messaging/types';

const NewsFeedEradicator = (store: Store) => {
	const state = store.getState();

	// TODO: Add quotes component
	const quoteDisplay = state.settings?.showQuotes ? QuoteDisplay(store) : null;

	const newFeatureLabel = areNewFeaturesAvailable(state)
		? h('span.nfe-label.nfe-new-features', 'New Features!')
		: null;

	const footerText = 'News Feed Eradicator';

	const onShowInfoPanel = () => {
		getBrowser().runtime.sendMessage({ t: MessageType.OPTIONS_PAGE_OPEN });
	};

	const link = h('a.nfe-info-link', { on: { click: onShowInfoPanel } }, [
		h('span', footerText),
		newFeatureLabel,
	]);

	// Entire app component
	return h('div', [quoteDisplay, link]);
};

export default NewsFeedEradicator;
