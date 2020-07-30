import { h } from 'snabbdom/h';
import QuoteOptions from './quote-options';
import { Store } from '../store';

const Heading = () => {
	return h('h1', 'News Feed Eradicator');
};

const Contribute = () => {
	return h('div', [
		h('h2', 'Contribute'),
		h('p', [
			h('span', 'News Feed Eradicator is open source. '),
			h(
				'a',
				{
					props: { href: 'https://github.com/jordwest/news-feed-eradicator/' },
				},
				'Fork on GitHub'
			),
		]),
	]);
};

const InfoPanel = (store: Store) => {
	return h('div.nfe-info-panel', [
		h('div.nfe-info-col', [
			Heading(),
			h('hr'),
			h('h2', 'Quotes'),
			QuoteOptions(store),
			h('hr'),
			Contribute(),
		]),
	]);
};

export default InfoPanel;
