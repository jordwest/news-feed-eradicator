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

		state.enabledSites.refetch();
		state.enabledScripts.refetch();
	};

	const disableSite = async (site: Site) => {
			const origins = originsForSite(site);
			await state.removePermissions({ origins, permissions: [] });

			await browser.runtime.sendMessage({
				type: 'disableSite',
				siteId: site.id
			});

			state.enabledSites.refetch();
			state.enabledScripts.refetch();
	}

	const id = `site-toggle-${site.id}`;

	return <>
		<div class="flex cross-center">
			<input id={id} type="checkbox" class="toggle" onClick={(e) => {
					if (state.siteState(site.id).enabled) {
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
				checked={state.siteState(site.id).enabled} />
			<label for={id} class="cursor-pointer p-1 flex-1">
				<Show when={state.sitesWithInvalidPermissions().includes(site.id)}>
					<span class="p-2">!</span>
				</Show>
				{site.title}
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

	return  <div class="flex">
		<div class="flex flex-col">
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
