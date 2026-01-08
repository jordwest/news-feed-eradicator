import type { SiteList } from "../types/sitelist"
import { abcNewsAu } from "./abc-news-au";
import { github } from "./github";
import { hackernews } from "./hackernews";
import { substack } from "./substack";
import { twitter } from "./twitter";
import { youtube } from "./youtube";

const sitelist: SiteList = {
	schemaVersion: 1,
	sites: [
		(await import('./facebook')).default,
		(await import('./instagram')).default,
		youtube,
		(await import('./reddit')).default,
		twitter,
		substack,
		abcNewsAu,
		hackernews,
		github,
	]
}

export default sitelist;
