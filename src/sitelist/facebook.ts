import { regionId, siteId, type Site } from "../types/sitelist";

export const site: Site = {
	id: siteId('facebook'),
	title: 'Facebook',
	hosts: ['www.facebook.com'],
	paths: ['/'],
	regions: [
		{
			id: regionId('main-feed'),
			title: 'Main feed',
			type: 'hide',
			paths: 'inherit',
			selectors: ['div.x1hc1fzr.x1unhpq9.x6o7n8i'],
			inject: {
				mode: 'before',
			}
		},

		{
			id: regionId('home-reels'),
			title: 'Reels',
			type: 'remove',
			paths: 'inherit',
			selectors: ['div.x193iq5w.xgmub6v.x1ceravr.x1v0nzow']
		}
	]
}

export default site;
