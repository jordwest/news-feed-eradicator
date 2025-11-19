import { type SiteList } from './types/sitelist';

export const siteList: SiteList = {
	schemaVersion: 1,
	sites: [
		{
			title: 'Old Reddit',
			hosts: ['old.reddit.com'],
			styles: [
				{
					id: 'sidebar',
					title: 'Sidebar',
					type: 'hide',
					selectors: ['div.side'],
				}
			]
		},
		{
			title: 'YouTube',
			hosts: ['www.youtube.com', 'youtube.com'],
			feed: {
				selectors: ['ytd-browse'],
				insertAt: 'overlay-fixed',
			},
			styles: [
				{
					id: 'sidebar',
					title: 'Related videos sidebar',
					type: 'hide',
					selectors: ['ytd-watch-next-secondary-results-renderer'],
				},
				{
					id: 'comments',
					title: 'Video comments',
					type: 'hide',
					selectors: ['ytd-comments'],
				}
			]
		},
		{
			title: 'Twitter/X',
			hosts: ['twitter.com', 'www.twitter.com', 'x.com', 'www.x.com'],
			feed: {
				selectors: ['div[aria-label="Home timeline"] > div > section[role="region"]'],
				insertAt: 'overlay',
			},
			styles: [],
		}
	]
};
