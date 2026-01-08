import { regionId, siteId, type Site } from "../types/sitelist";

const site: Site = {
	id: siteId('abc-news-au'),
	title: "ABC News Australia",
	hosts: ['abc.net.au', 'www.abc.net.au'],
	paths: ['/', '/news', '/news/*'],
	regions: [
		{
			id: regionId('news-home-feed'),
			title: 'Main home feed',
			selectors: ['#topStories', '[data-component="Sidebar"]', '[data-component="Section"]'],
			type: 'hide',
			paths: 'inherit',
			inject: {
				mode: 'before',
			}
		},
		{
			id: regionId('news-home-extra'),
			title: 'Additional home feeds',
			selectors: ['#stateTopStories', '#moreNews', '#nationalAndWorld', '[class^="Home_yourSayForYouGrid__"]', '#theBigPicture', '#videoShorts', '#aroundAustralia', '#politics', '#world', '#business', '#sport', '#lifestyle', '#entertainment', '#editors-choice', '[data-component="Recommendations"]', '[data-component="StandardCollection"]', '[class^="IndexPage_iviewRail__"]', '[data-component="podcastsCollection"]', '[data-component="customCollection"]', '[data-component="NewsSummary"]'],
			type: 'remove',
			paths: 'inherit',
		},
		{
			id: regionId('home-sidebars'),
			title: 'Home sidebars',
			selectors: ['[class^="Home_aside2__"]'],
			type: 'remove',
			paths: '*',
		},
		{
			id: regionId('article-sidebars'),
			title: 'Article sidebars',
			selectors: ['[class^="Article_aside__"]'],
			type: 'remove',
			paths: '*',
		},
		{
			id: regionId('article-footer-stories'),
			title: 'Article footer stories',
			selectors: ['[data-component="TopStories"]', '[data-component="LatestStories"]'],
			type: 'remove',
			paths: '*',
		},
	],
};

export default site;
