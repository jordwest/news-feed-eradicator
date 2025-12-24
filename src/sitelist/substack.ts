import { regionId, siteId, type Site } from "../types/sitelist";

export const substack: Site = {
			id: siteId('substack'),
			title: 'Substack',
			hosts: ['substack.com'],
			paths: ['/', '/home'],
			regions: [
				{
					id: regionId('main'),
					title: 'Main feed',
					type: 'hide',
					paths: 'inherit',
					// TODO: Replace aria-label with language agnostic selector
					selectors: ['div[aria-label="Notes feed"]'],
					inject: {
						mode: 'overlay',
						overlayZIndex: 998,
					}
				},
			]
		}
