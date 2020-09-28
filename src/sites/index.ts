export type SiteId = 'facebook' | 'twitter' | 'hackernews';
export const Sites: Record<SiteId, Site> = {
	facebook: {
		label: 'Facebook',
		domain: 'facebook.com',
		paths: ['/', '/'],
		origins: [
			'http://www.facebook.com/*',
			'https://www.facebook.com/*',
			'http://web.facebook.com/*',
			'https://web.facebook.com/*',
		],
	},
	twitter: {
		label: 'Twitter',
		domain: 'twitter.com',
		paths: ['/home', '/compose/tweet'],
		origins: ['http://twitter.com/*', 'https://twitter.com/*'],
	},
	hackernews: {
		label: 'Y Combinator News (HN)',
		domain: 'news.ycombinator.com',
		paths: ['/'],
		origins: ['https://news.ycombinator.com/*'],
	},
};

export type Site = {
	// Label displayed in the options UI
	label: string;

	// Note: these must also be added to optional_permissions in manifest.json
	origins: string[];

	// Will be enabled for any hostnames containing this value
	domain: string;

	// Will only be enabled for these paths
	paths: string[];
};
