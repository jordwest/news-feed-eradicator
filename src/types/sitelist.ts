export type SiteList = {
	schemaVersion: 1,
	sites: Site[]
};

export type SiteId = string & { __siteId: never };
export type RegionId = string & { __sectionId: never };

export const siteId = (id: string): SiteId => id as SiteId;
export const regionId = (id: string): RegionId => id as RegionId;

export type Path = string | { regexp: string };
export type PathList = Path[];

export type Site = {
	id: SiteId,
	title: string,
	hosts: string[],
	paths: PathList,
	popular?: boolean,
	regions: Region[]
};


export type Inject = {
	mode: 'firstChild' | 'lastChild' | 'before' | 'after' | 'overlay' | 'overlay-fixed'
	overlayZIndex?: number;
}

export type Region = {
	id: RegionId,
	selectors: string[],
	title: string,
	type: 'hide' | 'remove' | 'dull',
	paths: 'inherit' | '*' | PathList,
	default?: boolean,
	inject?: Inject,
}
