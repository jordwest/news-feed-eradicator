import type { RegionId, SiteId, SiteList } from "./types/sitelist"

const siteId = (id: string): SiteId => id as SiteId;
const regionId = (id: string): RegionId => id as RegionId;

const sitelist: SiteList = {
	schemaVersion: 1,
	sites: [
		{
			id: siteId('reddit-old'),
			title: "Reddit",
			hosts: ['www.reddit.com', 'old.reddit.com'],
			paths: ['/', '/new/', '/hot/', '/rising/', '/controversial/', '/top/', '/r/popular/', '/r/all/'],
			regions: [
				{
					id: regionId('feed'),
					title: 'Feed',
					selectors: ['#siteTable'],
					type: 'hide',
					paths: 'inherit',
					inject: {
						mode: 'before',
					}
				},
				{
					id: regionId('sidebar'),
					title: 'Sidebar',
					selectors: ['div.side'],
					type: 'hide',
					paths: '*',
				}
			],
		},
		{
			id: siteId('youtube'),
			title: 'YouTube',
			hosts: ['www.youtube.com', 'youtube.com'],
			paths: ['/'],
			regions: [
				{
					id: regionId('feed'),
					title: 'Main feed',
					selectors: ['ytd-browse'],
					paths: 'inherit',
					type: 'hide',
					inject: {
						mode: 'overlay-fixed',
						overlayZIndex: 2019,
					},
				},
				{
					id: regionId('shorts-button'),
					title: 'Shorts button',
					type: 'remove',
					paths: '*',
					selectors: ['ytd-guide-entry-renderer:has(a[title="Shorts"])'],
				},
				// {
				// 	id: 'sidebar',
				// 	title: 'Related videos sidebar',
				// 	type: 'hide',
				// 	selectors: ['ytd-watch-next-secondary-results-renderer'],
				// },
				// //{
				// //	id: 'comments',
				// //	title: 'Video comments',
				// //	type: 'hide',
				// //	selectors: ['ytd-comments'],
				// //},
				// {
				// 	id: 'live-chat',
				// 	title: 'Live chat',
				// 	type: 'hide',
				// 	default: false,
				// 	selectors: ['ytd-live-chat-frame'],
				// },
				// {
				// 	id: 'explore-nav',
				// 	title: 'Explore navigation menu',
				// 	type: 'remove',
				// 	selectors: ['ytd-guide-section-renderer:nth-child(4)']
				// }
			],
		},
		// {
		// 	id: 'twitter-x',
		// 	title: 'Twitter/X',
		// 	hosts: ['x.com'],
		// 	feed: {
		// 		paths: ['/home', '/'],
		// 		selectors: ['div[aria-label="Home timeline"] > div > section[role="region"]'],
		// 		insertAt: 'overlay',
		// 	},
		// 	styles: []
		// }
	]
}

export default sitelist;
