import { createMemo, For, Show } from "solid-js";
import { getBrowser } from "../../lib/webextension";
import type { Site } from "../../types/sitelist";
import { originsForSite } from "../../lib/util";
import { SiteConfigPanel } from "./site-configuration";
import { useOptionsPageState } from "./state";

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

	const bg = () => {
		return state.selectedSiteId.get() === site.id ? 'bg-accent-a200' : 'hover:bg-lighten-100';
	}

	return <>
		<div class="">
			<label for={id} class={`cursor-pointer px-4 py-2 space-x-2 flex cross-center ${bg()}`}>
				<input id={id} type="checkbox" class="toggle" onClick={(e) => {
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
					<span class="">!</span>
				</Show>
				<div class="flex flex-col">
					<div>{site.title}</div>
					<div class="font-sm text-figure-500">{site.hosts.join(', ')}</div>
				</div>
			</label>
		</div>
	</>
}

export const SiteList = () => {
	const state = useOptionsPageState();

	const selectedSite = createMemo(() => {
		const siteId = state.selectedSiteId.get();
		if (!siteId) return null;
		return state.siteList.get()?.sites.find(s => s.id === siteId) ?? null;
	});

	return  <div class="flex py-4">
		<div class={`flex flex-col ${selectedSite() == null ? 'flex-1' : ''}`}>
			<For each={state.siteList.get()?.sites}>
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
