import { regionId, siteId, type Site } from "../types/sitelist";

export const site: Site = {
	id: siteId('instagram'),
	title: 'Instagram',
	hosts: ['www.instagram.com'],
	paths: ['/'],
	regions: [
		{
			id: regionId('main-feed'),
			title: 'Main feed',
			type: 'hide',
			paths: 'inherit',
			selectors: ['section > main div.xw7yly9 > div.x1uhb9sk.x1nhvcw1'],
			inject: {
				mode: 'before',
			}
		},

		{
			id: regionId('home-stories'),
			title: 'Reels',
			type: 'remove',
			paths: 'inherit',
			selectors: ['section > main div.xw7yly9 > div.xmnaoh6']
		}
	]
}

export default site;
