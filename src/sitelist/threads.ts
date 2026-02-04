import { regionId, siteId, type Site } from "../types/sitelist";

export const site: Site = {
			id: siteId('threads'),
			title: 'Threads',
			hosts: ['www.threads.com'],
			paths: ['/'],
			regions: [
				{
					id: regionId('main'),
					title: 'Single column home feed',
					type: 'hide',
					paths: 'inherit',
					selectors: ['#barcelona-page-layout > div > div'],
					inject: {
						mode: 'overlay',
						overlayZIndex: 99999999
					}
				},
				{
					id: regionId('multi-column-view'),
					title: 'Multi column home',
					type: 'remove',
					paths: 'inherit',
					selectors: ['.x78zum5.xedcshv.xw2csxc.x10wlt62.x106a9eq.x1xnnf8n.xh8yej3'],
					inject: {
						mode: 'before',
						overlayZIndex: 99999999
					}
				}
			]
		}

export default site;
