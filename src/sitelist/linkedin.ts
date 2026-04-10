import { regionId, siteId, type Site } from "../types/sitelist";

export const site: Site = {
	id: siteId('linkedin'),
	title: 'LinkedIn',
	hosts: ['www.linkedin.com'],
	paths: ['/', '/feed', '/feed/'],
	regions: [
		{
			id: regionId('main-feed'),
			title: 'Main feed',
			type: 'hide',
			paths: 'inherit',
			selectors: ["main > div.relative > .scaffold-finite-scroll", "div[componentkey^='container-update-list_mainFeed']"],
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
