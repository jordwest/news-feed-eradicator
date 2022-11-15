import { h } from 'snabbdom/h';
import QuoteOptions from './quote-options';
import { Store } from '../store';
import { UiOptionsTabShow, ActionType } from '../store/action-types';
import { SitesOptions } from './sites-options';

const Heading = () => {
	return h('h3.text-center', 'News Feed Eradicator');
};

const Footer = () => {
	return h('div.text-center.text-muted.text-smaller-1', [
		h('span', 'by '),
		h('a', { props: { href: 'http://west.io' } }, 'Jordan West'),
		h('span', ' and '),
		h(
			'a',
			{
				props: {
					href: 'https://github.com/jordwest/news-feed-eradicator/graphs/contributors',
				},
			},
			'contributors'
		),
	]);
};

const About = () => {
	return h('div.v-stack-2', [
		h('div.v-stack-2', [
			h('h2', 'About'),
			h(
				'p',
				'News Feed Eradicator was born in 2012 in a bout of procrastination. I first noticed that ' +
					"I wasn't in control of my own mind when I found myself typing " +
					'"facebook.com" into the address bar unconsciously. '
			),
			h(
				'p',
				'Though I was forced to use Facebook for my studies, I realised I just had to find a way to reduce its addictive power over me. ' +
					'The number one thing that felt so addictive about it was the news feed.'
			),
			h(
				'p',
				"In recent years, we've seen the news feed proliferate across all sort of apps thanks to " +
					"its addictive power over users. I think it's long overdue that we as users take that power back."
			),
			h('p', [
				'News Feed Eradicator is and always will be free and ',
				h(
					'a.underline-hover',
					{
						props: {
							href: 'https://github.com/jordwest/news-feed-eradicator/',
						},
					},
					'open-source'
				),
				', ' + 'and will never track you.',
			]),
		]),
		h('div.v-stack-2', [
			h('h2', 'Support'),
			h(
				'p',
				"If News Feed Eradicator has saved you time or mental energy and you'd like to help out, there are a number of ways you can do so:"
			),
			h('ul', [
				h('li', 'Tell your friends about it'),
				h('li', [
					'Leave a review on the ',
					h(
						'a.underline-hover',
						{
							props: {
								href: 'https://chrome.google.com/webstore/detail/news-feed-eradicator-for/fjcldmjmjhkklehbacihaiopjklihlgg?hl=en',
							},
						},
						'Chrome'
					),
					' or ',
					h(
						'a.underline-hover',
						{
							props: {
								href: 'https://addons.mozilla.org/en-US/firefox/addon/news-feed-eradicator/',
							},
						},
						'Firefox'
					),
					' store',
				]),
				h('li', [
					'Report or fix bugs via ',
					h(
						'a.underline-hover',
						{
							props: {
								href: 'https://github.com/jordwest/news-feed-eradicator/',
							},
						},
						'GitHub'
					),
				]),
				h('li', [
					h(
						'a.underline-hover',
						{ props: { href: 'https://west.io/' } },
						'Let me know'
					),
					" how it's helped you",
				]),
				h(
					'li',
					h(
						'a.underline-hover',
						{ props: { href: 'https://gumroad.com/l/news-feed-eradicator' } },
						'Buy me a coffee'
					)
				),
			]),
		]),
	]);
};

const CurrentTab = (store: Store) => {
	const tab = store.getState().uiOptions.tab;
	switch (tab) {
		case 'sites':
			return SitesOptions(store);
		case 'quotes':
			return QuoteOptions(store);
		case 'about':
			return About();
	}
};

const InfoPanel = (store: Store) => {
	const state = store.getState();

	const visitTab = (id: UiOptionsTabShow['tab']) => () =>
		store.dispatch({
			type: ActionType.UI_OPTIONS_TAB_SHOW,
			tab: id,
		});
	const Tab = (id: UiOptionsTabShow['tab'], label: string) =>
		state.uiOptions.tab === id
			? h('a.strong.text-larger-1', { props: { href: 'javascript:;' } }, label)
			: h(
					'a.underline-hover.text-larger-1',
					{ props: { href: 'javascript:;' }, on: { click: visitTab(id) } },
					label
			  );

	return h('div.nfe-info-panel', [
		h('div.nfe-info-col.v-stack-4', [
			Heading(),
			h('div.flex.justify-center.h-stack-2', [
				Tab('sites', 'Sites'),
				Tab('quotes', 'Quotes'),
				Tab('about', 'About'),
			]),

			h('div.shadow-mid.bg-1.pad-3', [CurrentTab(store)]),
			Footer(),
		]),
	]);
};

export default InfoPanel;
