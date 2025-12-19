import type { Site } from "../types/sitelist";

export function originsForSite(site: Site) {
	return site.hosts.map(host => [`http://${host}/*`, `https://${host}/*`]).flat();
}

export function assertDefined<T>(value: T | null | undefined): T {
	if (value == null) {
		throw new Error(`Expected value to be defined, got ${value}`);
	}
	return value;
}
