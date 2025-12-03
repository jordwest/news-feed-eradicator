export type SiteList = {
	schemaVersion: 1,
	sites: Site[]
};

export type SiteId = string & { __siteId: never };
export type SectionId = string & { __sectionId: never };

export type Site = {
	id: SiteId,
	title: string,
	hosts: string[],
	paths: Path[],
	sections: Section[]
};

export type Path = string;

export type Inject = {
	mode: 'firstChild' | 'lastChild' | 'before' | 'after' | 'overlay' | 'overlay-fixed'
	overlayZIndex?: number;
}

export type Section = {
	id: SectionId,
	selectors: string[],
	title: string,
	type: 'hide' | 'remove' | 'dull',
	inject?: Inject,
}
