export type SiteList = {
	schemaVersion: 1,
	sites: Site[]
};

export type SiteId = string & { __siteId: never };
export type RegionId = string & { __sectionId: never };

export type Site = {
	id: SiteId,
	title: string,
	hosts: string[],
	paths: Path[],
	regions: Region[]
};

export type Path = string;

export type Inject = {
	mode: 'firstChild' | 'lastChild' | 'before' | 'after' | 'overlay' | 'overlay-fixed'
	overlayZIndex?: number;
}

export type Region = {
	id: RegionId,
	selectors: string[],
	title: string,
	type: 'hide' | 'remove' | 'dull',
	paths: 'inherit' | '*',
	inject?: Inject,
}
