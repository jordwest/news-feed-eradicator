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
			selectors: ['main > :nth-child(1) > div[style]'],
			inject: {
				mode: 'overlay',
			}
		},

		{
			id: regionId('home-stories'),
			title: 'Stories',
			type: 'remove',
			paths: 'inherit',
			selectors: ['section > main div.xw7yly9 > div.xmnaoh6']
		},

		{
			id: regionId('suggested-for-you'),
			title: 'Suggested for you',
			type: 'remove',
			paths: 'inherit',
			selectors: ['div:has(> div > a[href="/explore/people/"])']
		}
	]
}

export default site;
