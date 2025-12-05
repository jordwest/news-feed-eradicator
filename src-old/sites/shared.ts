import {SiteId, Sites} from "./index";

export function injectCSS(siteId: SiteId) {
	const css = Sites[siteId].css;

	if (css != null) {
		const style = document.createElement('style');
		style.textContent = css;
		document.addEventListener('DOMContentLoaded', () => {
			document.head.append(style);
		});
	}
}