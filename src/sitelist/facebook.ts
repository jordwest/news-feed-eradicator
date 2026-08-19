import { regionId, siteId, type Site } from "../types/sitelist";

export const site: Site = {
	id: siteId('facebook'),
	title: 'Facebook',
	hosts: ['www.facebook.com', 'web.facebook.com'],
	paths: ['/'],
	widgetAppearance: 'facebook',
	regions: [
		{
			id: regionId('main-feed'),
			title: 'Main feed',
			type: 'hide',
			paths: [{ pathname: '/', excludeSearch: ['filter=groups', 'sk=h_chr'] }],
			selectors: ['div.x1hc1fzr.x1unhpq9.x6o7n8i'],
			inject: {
				mode: 'before',
			}
		},
		{
			id: regionId('home-stories'),
			title: 'Stories',
			type: 'remove',
			paths: 'inherit',
			selectors: ['div.x193iq5w.xgmub6v.x1ceravr.x1v0nzow']
		},
		{
			id: regionId('groups-feed'),
			title: 'Groups feed',
			type: 'remove',
			default: false,
			paths: ['/groups/feed/'],
			selectors: ['div[role="feed"]'],
			inject: {
				mode: 'before',
			}
		},
		{
			id: regionId('chronological-groups-feed'),
			title: 'Chronological groups feed',
			type: 'hide',
			default: false,
			paths: [{ pathname: '/', search: ['filter=groups', 'sk=h_chr'] }],
			selectors: ['div.x1hc1fzr.x1unhpq9.x6o7n8i'],
			inject: {
				mode: 'before',
			}
		}
	]
}

export default site;
