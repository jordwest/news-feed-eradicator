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
			paths: ['/', '/gaming', '/podcasts'],
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
					selectors: ['ytd-guide-entry-renderer:has(a[title="Shorts"])', 'ytd-mini-guide-entry-renderer:has(a[title="Shorts"])'],
				},
				{
					id: regionId('explore-nav'),
					title: 'Explore navigation menu',
					type: 'remove',
					paths: '*',
					selectors: ['ytd-guide-section-renderer:nth-child(4)']
				},
				{
					id: regionId('sidebar'),
					title: 'Related videos sidebar',
					type: 'hide',
					paths: '*',
					selectors: ['ytd-watch-next-secondary-results-renderer'],
				},
				//{
				//	id: 'comments',
				//	title: 'Video comments',
				//	type: 'hide',
				//	paths: '*',
				//	selectors: ['ytd-comments'],
				//},
				{
					id: regionId('live-chat'),
					title: 'Live chat',
					type: 'hide',
					default: false,
					paths: '*',
					selectors: ['ytd-live-chat-frame'],
				},
			],
		},
		{
			id: siteId('twitter-x'),
			title: 'Twitter/X',
			hosts: ['x.com'],
			paths: ['/home', '/'],
			regions: [
				{
					id: regionId('home-timeline'),
					title: 'Main feed',
					type: 'hide',
					paths: 'inherit',
					selectors: ['div[aria-label="Home timeline"] > div > section[role="region"]'],
					inject: {
						mode: 'overlay',
					}
				},
			]
		}
	]
}

export default sitelist;
