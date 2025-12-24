import { regionId, siteId, type Site } from "../types/sitelist";

export const reddit: Site = {
	id: siteId('reddit'),
	title: "Reddit",
	hosts: ['www.reddit.com', 'old.reddit.com'],
	paths: ['/', '/new/', '/hot/', '/rising/', '/controversial/', '/top/', '/r/popular/', '/r/all/'],
	regions: [
		{
			id: regionId('feed'),
			title: 'Feed',
			selectors: ['#siteTable', 'shreddit-feed'],
			type: 'remove',
			paths: 'inherit',
			inject: {
				mode: 'before',
			}
		},
		{
			id: regionId('nav'),
			title: 'Navigation tabs (Old reddit)',
			selectors: ['ul.tabmenu', '#sr-header-area'],
			type: 'remove',
			paths: '*',
		},
		{
			id: regionId('sidebar'),
			title: 'Sidebar',
			selectors: ['div.side', 'reddit-sidebar-nav'],
			type: 'hide',
			default: false,
			paths: '*',
		},
		{
			id: regionId('recently-viewed-links'),
			title: 'Recently viewed links',
			selectors: ['div.spacer:has(div.sidecontentbox)', 'recent-posts'],
			type: 'remove',
			default: true,
			paths: '*',
		},
		{
			id: regionId('games-on-reddit'),
			title: 'Games on Reddit links',
			selectors: ['faceplate-tracker[noun="games_drawer"]', 'faceplate-tracker[noun="games_drawer"] + hr'],
			type: 'remove',
			default: true,
			paths: '*',
		}
	],
};
