import { createMemo, For, Show } from "solid-js";
import { getBrowser } from "/lib/webextension";
import type { Site } from "/types/sitelist";
import { originsForSite } from "/lib/util";
import { SiteConfigPanel } from "./site-configuration";
import { useOptionsPageState } from "../../state";

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
					<div class="font-sm text-figure-500">{site.hosts.join(', ')}</div>
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
			<ul class={`flex flex-col py-2 ${selectedSite() == null ? 'flex-1' : 'br-1'}`}>
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
		<Show when={state.settingsLockedDown()}>
			<div class="overlay flex cross-center axis-center">
				<div class="card shadow rounded p-4 text-center flex flex-col gap-2">
					<h3 class="font-xl">
						🔒 Site settings locked down
					</h3>
					<p class="text-secondary">
						To unlock, start snoozing then click the button below
					</p>
				</div>

			</div>
		</Show>
	</div>
};

export const SitesTabContent = () => {
	const state = useOptionsPageState();

	return <div>
		<SiteList />
		<div class="p-2 bg-darken-100 flex gap-4 cross-center axis-end">
			<Show when={!state.settingsLockedDown()}>
				<label class="text-secondary font-xs">Done choosing sites for now? Lock them in.</label>
				<button class="primary font-sm" onClick={() => state.setSettingsLocked(true)}>Lock site settings</button>
			</Show>
			<Show when={state.settingsLockedDown()}>
				<button class="secondary font-sm" disabled={!state.canUnlockSettings()} onClick={() => state.setSettingsLocked(false)}>
					Unlock site settings
				</button>
			</Show>
		</div>
	</div>
}
