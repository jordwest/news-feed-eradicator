import { createMemo, createResource, createSignal, For, Show } from "solid-js";
import { getBrowser, type Permissions } from "../../lib/webextension";
import type { Site, SiteId, SiteList as ISiteList } from "../../types/sitelist";
import { originsForSite } from "../../lib/util";
import { SiteConfigPanel } from "./site-configuration";
import { useOptionsPageState } from "./state";

const browser = getBrowser();

const [permissions, setPermissions] = createSignal<Permissions>({permissions: [], origins: []});

function reloadPermissions() {
	browser.permissions.getAll().then(setPermissions);
}

reloadPermissions();

const [siteList] = createResource<ISiteList | undefined>(async () => {
	const siteListUrl = browser.runtime.getURL('sitelist.json');
	return await fetch(siteListUrl).then(siteList => siteList.json());
});

const [enabledSiteIds, { refetch: refreshEnabledSites }] = createResource(async () => {
	const scripts = await browser.scripting.getRegisteredContentScripts();
	return scripts.map(script => script.id) as SiteId[];
});
const isSiteEnabled = (site: Site) => enabledSiteIds()?.includes(site.id)

async function enableSite(site: Site) {
	const origins = originsForSite(site);

	const permissionAccepted = await browser.permissions.request({ origins, permissions: [] });

	if (!permissionAccepted) {
		return disableSite(site);
	}

	reloadPermissions();

	await browser.runtime.sendMessage({
		type: 'enableSite',
		siteId: site.id
	});

	refreshEnabledSites();
};

const disableSite = async (site: Site) => {
	const origins = originsForSite(site);
	await browser.permissions.remove({ origins, permissions: [] });

	await browser.runtime.sendMessage({
		type: 'disableSite',
		siteId: site.id
	});

	refreshEnabledSites();
}

const Site = ({ site }: { site: Site }) => {
	const state = useOptionsPageState();

	const id = `site-checkbox-${site.id}`;

	return <>
		<div class="flex cross-center">
			<input id={id} type="checkbox" class="toggle" onClick={(e) => {
					if (isSiteEnabled(site)) {
						if (state.selectedSiteId.get() === site.id) {
							disableSite(site);
						} else {
							state.selectedSiteId.set(site.id);
							e.preventDefault();
							return false;
						}
					} else {
						state.selectedSiteId.set(site.id);
						enableSite(site);
					}
				} }
				checked={isSiteEnabled(site)} />
			<label for={id} class="cursor-pointer p-1 flex-1">{site.title}</label>
		</div>
	</>
}

export const SiteList = () => {
	const state = useOptionsPageState();

	const selectedSite = createMemo(() => {
		const siteId = state.selectedSiteId.get();
		if (!siteId) return null;
		return siteList()?.sites.find(s => s.id === siteId) ?? null;
	});

	return  <div class="flex">
		<div class="flex flex-col">
			<For each={siteList()?.sites}>
				{site => <Site site={site} />}
			</For>
		</div>
		<Show when={selectedSite() != null}>
			<div class="flex-1 bl-1">
				<SiteConfigPanel site={selectedSite} />
			</div>
		</Show>
	</div>
};
