import { createMemo, For, Show } from "solid-js";
import { getBrowser } from "/lib/webextension";
import type { Site } from "/types/sitelist";
import { originsForSite } from "/lib/util";
import { SiteConfigPanel } from "./site-configuration";
import { useOptionsPageState } from "../../state";
import { LockedSettingsOverlay, SettingsLockFooter } from "../../lock";

const browser = getBrowser();

const Site = ({ site }: { site: Site }) => {
	const state = useOptionsPageState();

	async function enableSite(site: Site) {
		const origins = originsForSite(site);

		const permissionAccepted = await state.requestPermissions({ origins, permissions: [] });

		if (!permissionAccepted) {
			return disableSite(site);
		}

		await browser.runtime.sendMessage({
			type: 'enableSite',
			siteId: site.id
		});

		await state.enabledSites.refetch();
		await state.enabledScripts.refetch();
	};

	const disableSite = async (site: Site) => {
		const origins = originsForSite(site);

		await browser.runtime.sendMessage({
			type: 'disableSite',
			siteId: site.id
		});

		await Promise.allSettled([
			state.removePermissions({ origins, permissions: [] }),
			state.enabledSites.refetch(),
			state.enabledScripts.refetch(),
		]);
		state.selectedSiteId.set(null);
	}

	const id = `site-toggle-${site.id}`;

	return <>
		<li class="hoverable" aria-selected={state.selectedSiteId.get() === site.id}>
			<label for={id} class={`cursor-pointer px-4 py-2 gap-2 flex cross-center`}>
				<input id={id} type="checkbox" disabled={state.settingsLockedDown()} class="toggle" onClick={(e) => {
						e.preventDefault();
						if (state.siteState(site.id).enabled) {
							if (state.selectedSiteId.get() === site.id) {
								disableSite(site);
							} else {
								state.selectedSiteId.set(site.id);
								return false;
							}
						} else {
							state.selectedSiteId.set(site.id);
							enableSite(site);
						}
					} }
					checked={state.siteState(site.id).enabled} />
				<Show when={state.sitesWithInvalidPermissions().includes(site.id)}>
					<span class="">⚠️</span>
				</Show>
				<div class="flex flex-col">
					<div>{site.title}</div>
					<div class="font-xs text-figure-500">{site.hosts.join(', ')}</div>
				</div>
			</label>
		</li>
	</>
}

export const SiteList = () => {
	const state = useOptionsPageState();

	const selectedSite = createMemo(() => {
		const siteId = state.selectedSiteId.get();
		if (!siteId) return null;
		return state.siteList.get()?.sites.find(s => s.id === siteId) ?? null;
	});

	return  <div class="overlay-container">
		<div class="flex blur-disabled" aria-disabled={state.settingsLockedDown()}>
			<ul class={`flex flex-col py-2 ${selectedSite() == null ? 'flex-1' : 'br-1 mw-xs'}`}>
				<For each={state.siteList.get()?.sites}>
					{site => <Site site={site} />}
				</For>
			</ul>
			<Show when={selectedSite() != null}>
				<div class="flex-1">
					<SiteConfigPanel site={selectedSite} />
				</div>
			</Show>
		</div>

		<LockedSettingsOverlay />
	</div>
};

export const SitesTabContent = () => {
	return <div>
		<SiteList />
		<SettingsLockFooter />
	</div>
}
