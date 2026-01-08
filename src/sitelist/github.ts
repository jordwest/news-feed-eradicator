import { regionId, siteId, type Site } from "../types/sitelist";

export const github: Site = {
			id: siteId('github'),
			title: 'GitHub',
			hosts: ['github.com'],
			paths: ['/', '/feed'],
			regions: [
				{
					id: regionId('dashboard'),
					title: 'Dashboard',
					type: 'remove',
					paths: 'inherit',
					selectors: ['#dashboard', '#feed'],
					inject: {
						mode: 'before',
					}
				},
				{
					id: regionId('sidebar'),
					title: 'Sidebar',
					type: 'remove',
					paths: 'inherit',
					selectors: ['aside.feed-right-column'],
				}
			]
		}
