import { createMemo, For, Show, refresh, Loading } from "solid-js";
import { getBrowser } from "/lib/webextension";
import type { Site } from "/types/sitelist";
import { originsForSite } from "/lib/util";
import { SiteConfigPanel } from "./site-configuration";
import { useOptionsPageState } from "../../state";
import { LockedSettingsOverlay, SettingsLockFooter } from "../../lock";
import { createMediaQuery } from "@solid-primitives/media";
import { Skeleton } from "/shared/components/skeleton";

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

		await refresh(state.enabledSites);
		await refresh(state.enabledScripts);
	};

	const disableSite = async (site: Site) => {
		const origins = originsForSite(site);

		await browser.runtime.sendMessage({
			type: 'disableSite',
			siteId: site.id
		});

		await Promise.allSettled([
			state.removePermissions({ origins, permissions: [] }),
			refresh(state.enabledSites),
			refresh(state.enabledScripts),
		]);
		state.selectedSiteId.set(null);
	}

	const id = `site-toggle-${site.id}`;

	const isSelected = () => state.selectedSiteId.get() === site.id;

	return <>
		<li class="hoverable" aria-selected={(state.selectedSiteId.get() === site.id) ? "true" : "false"}>
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
		<Show when={isSelected() && state.isSmallScreen()}>
			<li class="px-4 bg-darken-100 bb-1">
				<SiteConfigPanel site={() => site} />
			</li>
		</Show>
	</>
}

export const SiteList = () => {
	const state = useOptionsPageState();

	const selectedSite = createMemo(() => {
		const siteId = state.selectedSiteId.get();
		if (!siteId) return null;
		return state.siteList()?.sites.find(s => s.id === siteId) ?? null;
	});

	const showSidePanel = () => selectedSite() != null && !state.isSmallScreen();

	return  <div class="overlay-container">
		<div class="flex blur-disabled" aria-disabled={state.settingsLockedDown() ? "true" : "false"}>
			<ul class={`flex viewport-scroller flex-col py-2 ${showSidePanel() ? 'br-1 mw-xs' : 'flex-1'}`}>
				<Loading fallback={<Skeleton width="100%" height="400px" />}>
					<For each={state.siteList()?.sites}>
						{site => <Site site={site} />}
					</For>
				</Loading>
			</ul>
			<Show when={showSidePanel()}>
				<div class="flex-1">
					<Loading>
						<SiteConfigPanel site={selectedSite} />
					</Loading>
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
