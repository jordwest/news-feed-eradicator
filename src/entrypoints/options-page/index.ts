import { getBrowser, type Permissions } from "../../lib/webextension";

import { render } from "solid-js/web";
import h from "solid-js/h";
import { createSignal, For, createResource } from "solid-js";

import { type SiteList, type Site } from "../../types/sitelist";

const browser = getBrowser();

const [permissions, setPermissions] = createSignal<Permissions>({permissions: [], origins: []});

function reloadPermissions() {
	browser.permissions.getAll().then(setPermissions);
}

reloadPermissions();

const [siteList] = createResource<SiteList | undefined>(async () => {
	const siteListUrl = browser.runtime.getURL('sitelist.json');
	return await fetch(siteListUrl).then(siteList => siteList.json());
});

function originsForSite(site: Site) {
	return site.hosts.map(host => [`http://${host}/*`, `https://${host}/*`]).flat();
}

async function requestSite(site: Site) {
	const browser = getBrowser();
	const origins = originsForSite(site);
	const result = await browser.permissions.request({ origins, permissions: [] });

	console.log('requesting permission for', origins);

	reloadPermissions();

	// const port = browser.runtime.connect();
	browser.scripting.registerContentScripts([{
		id: origins.join(''),
		js: ['/intercept/intercept.js'],
		runAt: "document_start",
		matches: origins,
		allFrames: false,
		// world: "MAIN"
	}]);

	console.log(result);
};

const Site = ({ site }: { site: Site }) => {
	return h('div.p-2', [
		h('span', () => originsForSite(site).every(origin => permissions().origins.includes(origin)) ? 'ENABLED' : "X"),
		h('span', site.title),
		h('button', { onClick: (_e) => requestSite(site) }, 'Request permissions')
	]);
}

const SiteList = () => {
	return h(For, {
		each: () => siteList()?.sites,
		children: (site: Site) => h(Site, { site })
	});
};

render(h(SiteList), document.querySelector("#root")!);
