export type SiteList = {
	schemaVersion: 1,
	sites: Site[]
};

export type SiteId = string & { __siteId: never };

export type Site = {
	id: SiteId,
	title: string,
	hosts: string[],
	feed?: Feed,
	styles: StyleGroup[]
};

export type Feed = {
	selectors: string[],
	paths: string[],
	insertAt: 'firstChild' | 'lastChild' | 'before' | 'after' | 'overlay' | 'overlay-fixed'
	overlayZIndex: number;
}

export type StyleGroup = {
	id: string,
	title: string,
	type: 'hide' | 'remove',
	selectors: string[],
}
