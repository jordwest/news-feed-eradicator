import { regionId, siteId, type Site } from "../types/sitelist";

export const site: Site = {
	id: siteId('tiktok'),
	title: 'TikTok',
	hosts: ['www.tiktok.com'],
	paths: ['/', '/foryou', '/following'],
	regions: [
		{
			id: regionId('main-feed'),
			title: 'Main feed',
			type: 'hide',
			paths: 'inherit',
			selectors: [
				'[data-e2e="recommend-list"]',
				'[data-e2e="recommend-list-item-container"]',
			],
			inject: {
				mode: 'overlay-fixed',
				overlayZIndex: 99999999,
			}
		},
		{
			id: regionId('video-recommendations'),
			title: 'Recommended videos on video pages',
			type: 'remove',
			paths: [{ regexp: '^/@[^/]+/video/' }],
			selectors: [
				'[data-e2e="recommend-list"]',
				'[data-e2e="recommend-list-item-container"]',
			],
		}
	]
}

export default site;
