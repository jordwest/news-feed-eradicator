import type { Quote } from "../quote";
import type { Site } from "../types/sitelist";

export function originsForSite(site: Site) {
	return site.hosts.map(host => [`http://${host}/*`, `https://${host}/*`]).flat();
}

export function expect<T>(value: T | null | undefined): T {
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

export const quotesByAuthor = (a: Quote, b: Quote) => {
	if (a.author < b.author) return -1;
	if (a.author > b.author) return 1;

	if (a.text < b.text) return -1;
	if (a.text > b.text) return 1;

	return 0;
}

export const autoFocus = ({ autoSelect }: { autoSelect?: boolean } = {}) => (el: HTMLElement) => {
	setTimeout(() => {
		el.focus();
		if (autoSelect && (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) {
			el.select();
		}
	}, 1)
}
