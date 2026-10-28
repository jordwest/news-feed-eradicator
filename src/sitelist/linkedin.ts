import { regionId, siteId, type Site } from "../types/sitelist";

export const site: Site = {
	id: siteId('linkedin'),
	title: 'LinkedIn',
	hosts: ['www.linkedin.com'],
	// LinkedIn split the home feed into tabs: /feed/ now redirects to
	// /feed/foryou/, and the Network tab is /feed/network/. Match the bare
	// feed paths plus both tabs, but not deeper paths such as
	// /feed/update/<id> (single post permalinks).
	paths: ['/', '/feed', '/feed/', { regexp: '^/feed/(foryou|network)/?$' }],
	regions: [
		{
			id: regionId('main-feed'),
			title: 'Main feed',
			type: 'hide',
			paths: 'inherit',
			selectors: [
				"main > div.relative > .scaffold-finite-scroll",
				// "For you" tab
				"div[componentkey^='container-update-list_mainFeed']",
				// "Network" tab
				"div[componentkey^='container-update-list_NetworkFeedListCollection']",
			],
			inject: {
				mode: 'before',
			}
		},
		{
			id: regionId('news-sidebar'),
			title: 'News sidebar',
			type: 'remove',
			paths: '*',
			selectors: [
				'#feed-news-module',
				'div:has(> div > div[data-view-name="news-module"])',
				'main#workspace > div:nth-child(1) > div:nth-child(1) > aside:nth-child(3) > div:first-child > div:first-child',
			],
		}
	]
}

export default site;
