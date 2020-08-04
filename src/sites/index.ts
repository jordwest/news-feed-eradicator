export type SiteId = 'facebook' | 'twitter';
export type Site = {
	label: string;
	// Note: these must also be added to optional_permissions in manifest.json
	origins: string[];
};

export const Sites: Record<SiteId, Site> = {
	facebook: {
		label: 'Facebook',
		origins: [
			'http://www.facebook.com/*',
			'https://www.facebook.com/*',
			'http://web.facebook.com/*',
			'https://web.facebook.com/*',
		],
	},
	twitter: {
		label: 'Twitter',
		origins: ['http://twitter.com/*', 'https://twitter.com/*'],
	},
};
