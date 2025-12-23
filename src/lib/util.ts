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

export const downloadFile = (blob: Blob, filename: string) => {
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}
