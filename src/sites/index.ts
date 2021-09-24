export type SiteId = 'facebook' | 'twitter' | 'reddit' | 'hackernews' | 'linkedin' | 'youtube' | 'instagram' | 'github';

export const Sites: Record<SiteId, Site> = {
	facebook: {
		label: 'Facebook',
		domain: 'facebook.com',
		paths: [
			'/',
			'/home.php',
			'/watch',
			'/marketplace/',
			'/groups/feed/',
			'/gaming/feed/',
		],
		origins: [
			'http://www.facebook.com/*',
			'https://www.facebook.com/*',
			'http://web.facebook.com/*',
			'https://web.facebook.com/*',
		],
	},
	instagram: {
		label: 'Instagram',
		domain: 'instagram.com',
		paths: ['/'],
		origins: [
			'http://www.instagram.com/*',
			'https://www.instagram.com/*',
		],
	},
	twitter: {
		label: 'Twitter',
		domain: 'twitter.com',
		paths: ['/home', '/compose/tweet'],
		origins: ['http://twitter.com/*', 'https://twitter.com/*'],
	},
	youtube: {
		label: 'YouTube',
		domain: 'youtube.com',
		paths: ['/', '/feed/trending'],
		origins: ['https://www.youtube.com/*'],
	},
	linkedin: {
		label: 'LinkedIn',
		domain: 'linkedin.com',
		paths: ['/', '/feed/'],
		origins: [
			'http://www.linkedin.com/*',
			'https://www.linkedin.com/*',
		],
	},
	reddit: {
		label: 'Reddit',
		domain: 'reddit.com',
		paths: ['/', '/home/', '/hot/', '/new/', '/top/', '/rising/'],
		pathRegExps: [/^\/r\/\w*\//], // represents: `/r/*`, as every subreddit has a feed and every post has a feed below the comments
		origins: [
			'https://www.reddit.com/*',
			'http://www.reddit.com/*',
			'https://old.reddit.com/*',
			'http://old.reddit.com/*',
		],
	},
	hackernews: {
		label: 'Y Combinator News (HN)',
		domain: 'news.ycombinator.com',
		paths: ['/', '/news'],
		origins: ['https://news.ycombinator.com/*'],
	},
	github: {
		label: 'Github',
		domain: 'github.com',
		paths: ['/'],
		origins: ['https://github.com/*'],
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

	// Optional, regular expressions to represent enabled paths
	pathRegExps?: RegExp[];
};
