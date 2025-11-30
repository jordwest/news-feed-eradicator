import { getBrowser, type Permissions } from "../../lib/webextension";

import { render } from "solid-js/web";
import h from "solid-js/h";
import { createSignal, For, createResource } from "solid-js";

import { type SiteList, type Site, type SiteId } from "../../types/sitelist";

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

const [enabledSiteIds, { refetch: refreshEnabledSites }] = createResource(async () => {
	const scripts = await browser.scripting.getRegisteredContentScripts();
	return scripts.map(script => script.id) as SiteId[];
});
const isSiteEnabled = (site: Site) => enabledSiteIds()?.includes(site.id)

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
	await browser.scripting.registerContentScripts([{
		id: site.id,
		js: ['/intercept/intercept.js'],
		runAt: "document_start",
		matches: origins,
		allFrames: false,
		// world: "MAIN"
	}]);

	refreshEnabledSites();
};

const disableSite = async (site: Site) => {
	await browser.scripting.unregisterContentScripts({ ids: [site.id] });
	refreshEnabledSites();

	browser.runtime.sendMessage({
		type: 'disableSite',
		siteId: site.id
	})
}

const Site = ({ site }: { site: Site }) => {
	return h('div.p-2', [
		h('span', () => isSiteEnabled(site) ? 'ENABLED' : "X"),
		h('span', site.title),
		h('button', { onClick: (_e) => isSiteEnabled(site) ? disableSite(site) : requestSite(site) }, () => isSiteEnabled(site) ? 'Disable' : 'Request permissions'),
	]);
}

const SiteList = () => {
	return h(For, {
		each: () => siteList()?.sites,
		children: (site: Site) => h(Site, { site })
	});
};

const Snooze = () => {
	return h('button', { onClick: (_e) => { browser.runtime.sendMessage({
		type: 'snooze',
		until: Date.now() + 1000 * 10,
	})}}, 'Snooze')
}

const OptionsPage = () => {
	return h('div', [
		h('h1', 'Options'),
		h(Snooze),
		h(SiteList)
	]);
}

render(h(OptionsPage), document.querySelector("#root")!);
