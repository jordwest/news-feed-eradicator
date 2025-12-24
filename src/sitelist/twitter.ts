import { regionId, siteId, type Site } from "../types/sitelist";

export const twitter: Site = {
			id: siteId('twitter'),
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
