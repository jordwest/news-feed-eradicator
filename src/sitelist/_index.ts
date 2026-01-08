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
		(await import('./reddit')).default,
		youtube,
		twitter,
		hackernews,
		substack,
		abcNewsAu,
		github,
		(await import('./facebook')).default,
	]
}

export default sitelist;
