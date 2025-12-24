import type { SiteList } from "../types/sitelist"
import { hackernews } from "./hackernews";
import { reddit } from "./reddit";
import { twitter } from "./twitter";
import { youtube } from "./youtube";

const sitelist: SiteList = {
	schemaVersion: 1,
	sites: [
		reddit,
		youtube,
		twitter,
		hackernews,
	]
}

export default sitelist;
