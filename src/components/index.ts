import QuoteDisplay from './quote-display';
import InfoPanel from './info-panel';

import { Store } from '../store';
import { areNewFeaturesAvailable } from '../store/selectors';

import { h } from 'snabbdom/h';
import { getBrowser } from '../webextension';
import { MessageType } from '../messaging/types';

const NewsFeedEradicator = (store: Store) => {
	const state = store.getState();

	// TODO: Add quotes component
	const quoteDisplay = state.showQuotes ? QuoteDisplay(store) : null;

	const newFeatureLabel = areNewFeaturesAvailable(state)
		? h('span.nfe-label.nfe-new-features', 'New Features!')
		: null;

	const infoPanel = state.showInfoPanel ? InfoPanel(store) : null;

	const footerText = 'News Feed Eradicator';

	const onShowInfoPanel = () => {
		console.log(
			getBrowser().runtime.sendMessage({ t: MessageType.OPTIONS_PAGE_OPEN })
		);
		window['getBrowser'] = getBrowser;
	};
	//getBrowser()
	//	.runtime.openOptionsPage()
	//	.catch(e => console.error(e));

	const link = h('a.nfe-info-link', { on: { click: onShowInfoPanel } }, [
		h('span', footerText),
		newFeatureLabel,
	]);

	// Entire app component
	return h('div', [infoPanel, quoteDisplay, link]);
};

export default NewsFeedEradicator;
