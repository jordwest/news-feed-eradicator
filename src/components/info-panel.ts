import { h } from 'snabbdom/h';
import { hideInfoPanel } from '../store/actions';
import Settings from './settings';
import { Store } from '../store';

const Heading = (store: Store) => {
	const closeInfoPanel = () => {
		store.dispatch(hideInfoPanel());
	};

	return [
		h('h1', 'News Feed Eradicator'),
		h(
			'a.nfe-close-button',
			{
				props: { title: 'Close information panel' },
				on: { click: closeInfoPanel },
			},
			'X'
		),
	];
};

const Icon = (svgPath: string) => (color: string) =>
	h(
		'svg',
		{
			attrs: {
				x: '0px',
				y: '0px',
				width: '32px',
				height: '32px',
				viewBox: '0 0 32 32',
				'enable-background': 'new 0 0 32 32',
			},
		},
		[h('path', { attrs: { fill: color, d: svgPath } })]
	);

const FacebookIcon = Icon(
	'M30.7,0H1.3C0.6,0,0,0.6,0,1.3v29.3C0,31.4,0.6,32,1.3,32H17V20h-4v-5h4v-4 c0-4.1,2.6-6.2,6.3-6.2C25.1,4.8,26.6,5,27,5v4.3l-2.6,0c-2,0-2.5,1-2.5,2.4V15h5l-1,5h-4l0.1,12h8.6c0.7,0,1.3-0.6,1.3-1.3V1.3 C32,0.6,31.4,0,30.7,0z'
);
const TwitterIcon = Icon(
	'M32,6.1c-1.2,0.5-2.4,0.9-3.8,1c1.4-0.8,2.4-2.1,2.9-3.6c-1.3,0.8-2.7,1.3-4.2,1.6C25.7,3.8,24,3,22.2,3 c-3.6,0-6.6,2.9-6.6,6.6c0,0.5,0.1,1,0.2,1.5C10.3,10.8,5.5,8.2,2.2,4.2c-0.6,1-0.9,2.1-0.9,3.3c0,2.3,1.2,4.3,2.9,5.5 c-1.1,0-2.1-0.3-3-0.8c0,0,0,0.1,0,0.1c0,3.2,2.3,5.8,5.3,6.4c-0.6,0.1-1.1,0.2-1.7,0.2c-0.4,0-0.8,0-1.2-0.1 c0.8,2.6,3.3,4.5,6.1,4.6c-2.2,1.8-5.1,2.8-8.2,2.8c-0.5,0-1.1,0-1.6-0.1C2.9,27.9,6.4,29,10.1,29c12.1,0,18.7-10,18.7-18.7 c0-0.3,0-0.6,0-0.8C30,8.5,31.1,7.4,32,6.1z'
);

const Share = () => {
	return [
		h('h2', 'Share'),
		h('div.nfe-social-media-icons', [
			h(
				'a.nfe-social-media-icon',
				{ props: { href: 'https://www.facebook.com/NewsFeedEradicator/' } },
				[FacebookIcon('#4f92ff')]
			),
			h(
				'a.nfe-social-media-icon',
				{ props: { href: 'https://twitter.com/NewsFeedErad' } },
				[TwitterIcon('#4f92ff')]
			),
		]),
	];
};

const Contribute = () => {
	return [
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
	];
};

const Remove = () => {
	return [
		h('h2', 'Remove'),
		h('ul', [
			h('li', [
				h(
					'a',
					{
						props: {
							href: 'https://west.io/news-feed-eradicator/remove.html',
						},
					},
					'Removal Instructions'
				),
			]),
		]),
	];
};

const InfoPanel = (store: Store) => {
	return h('div.nfe-info-panel', [
		h(
			'div.nfe-info-col',
			[].concat(
				Heading(store),
				h('hr'),
				h('h2', 'Settings'),
				Settings(store),
				h('hr'),
				Share(),
				h('hr'),
				Contribute(),
				h('hr'),
				Remove()
			)
		),
	]);
};

export default InfoPanel;
