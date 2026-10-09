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
			selectors: [
				"main > div.relative > .scaffold-finite-scroll",
				// The "Start a post" composer is the first item of the feed list, so hide
				// every item except the composer. Items (and some of their children) are
				// `display: contents` wrappers that opacity has no effect on, so target
				// everything inside them. NFE injects its element before the first match
				// of the first selector, so that one skips the injected element.
				"div[componentkey^='container-update-list_mainFeed'] > :not(:has(#shareboxProfilePictureComponentRef)):not(:has(a[href*='/sharebox/'])) > :not([id^='nfe-root'])",
				"div[componentkey^='container-update-list_mainFeed'] > :not(:has(#shareboxProfilePictureComponentRef)):not(:has(a[href*='/sharebox/'])) > * *",
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
