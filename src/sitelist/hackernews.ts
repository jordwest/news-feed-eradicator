import { regionId, siteId, type Site } from "../types/sitelist";

const site: Site = {
	id: siteId('hackernews'),
	title: 'Hacker News',
	hosts: ['news.ycombinator.com'],
	paths: ['/', '/news', '/front', '/newest', '/newcomments', '/ask', '/show'],
	regions: [
		{
			id: regionId('main'),
			title: 'Main feed',
			type: 'remove',
			paths: 'inherit',
			selectors: ['tr#bigbox td table'],
			inject: {
				mode: 'before',
			}
		},
	]
}

export default site;
