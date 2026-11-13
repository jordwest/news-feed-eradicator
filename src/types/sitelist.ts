export type SiteList = {
	schemaVersion: 1,
	/** Git commit hash the list was built from */
	commit: string,
	/** UTC build time, formatted `YYYYMMDD_HHMM` (e.g. `20261113_2314`) */
	buildTimestamp: string,
	sites: Site[]
};

/** The hand-maintained part of the list; build metadata is added at build time. */
export type SiteListSource = Omit<SiteList, 'commit' | 'buildTimestamp'>;

/** Contents of `manifest.json` */
export type Manifest = Pick<SiteList, 'commit' | 'buildTimestamp'>;

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
