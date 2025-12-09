import type { Site } from "../types/sitelist";

export function originsForSite(site: Site) {
	return site.hosts.map(host => [`http://${host}/*`, `https://${host}/*`]).flat();
}
