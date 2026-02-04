import type { SiteList } from "../types/sitelist"

const sitelist: SiteList = {
	schemaVersion: 1,
	sites: [
		(await import('./facebook')).default,
		(await import('./instagram')).default,
		(await import('./youtube')).default,
		(await import('./reddit')).default,
		(await import('./twitter')).default,
		(await import('./linkedin')).default,
		(await import('./threads')).default,
		(await import('./bluesky')).default,
		(await import('./substack')).default,
		(await import('./github')).default,
		(await import('./hackernews')).default,
		(await import('./abc-news-au')).default,
	]
}

export default sitelist;
