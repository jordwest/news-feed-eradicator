import { regionId, siteId, type Site } from "../types/sitelist";

const site: Site = {
	id: siteId('reddit'),
	title: "Reddit",
	hosts: ['www.reddit.com', 'old.reddit.com'],
	paths: ['/', '/new/', '/hot/', '/rising/', '/controversial/', '/top/'],
	popular: true,
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
			id: regionId('subreddit-feed'),
			title: 'Subreddit Feed',
			selectors: ['#siteTable', 'shreddit-feed'],
			type: 'remove',
			paths: [
				{ regexp: '^/r/[a-zA-Z0-9_-]+/(top\/)?$' }
			],
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
			id: regionId('carousel'),
			title: 'Gallery Carousel',
			selectors: ['shreddit-gallery-carousel'],
			type: 'remove',
			paths: '*',
		},
		{
			id: regionId('nav-sidebar'),
			title: 'Left navigation sidebar',
			selectors: ['reddit-sidebar-nav'],
			type: 'hide',
			default: false,
			paths: '*',
		},
		{
			id: regionId('sidebar'),
			title: 'Right sidebar',
			selectors: ['div.side', '#right-sidebar-contents'],
			type: 'hide',
			default: false,
			paths: '*',
		},
		{
			id: regionId('recently-viewed-links'),
			title: 'Recently viewed',
			selectors: ['div.spacer:has(div.sidecontentbox)', 'recent-posts'],
			type: 'remove',
			default: true,
			paths: '*',
		},
		{
			id: regionId('games-on-reddit'),
			title: 'Games on Reddit',
			selectors: ['faceplate-tracker[noun="games_drawer"]', 'faceplate-tracker[noun="games_drawer"] + hr'],
			type: 'remove',
			default: true,
			paths: '*',
		}
	],
};

export default site;
