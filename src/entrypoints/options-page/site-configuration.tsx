import { createResource, For, type Accessor } from "solid-js";
import type { RegionId, Site, SiteId } from "../../types/sitelist";
import { loadRegionsForSite, setRegionEnabledForSite } from "../../storage/storage";
import { sendToServiceWorker } from "../../messaging/messages";
import { expect } from "../../lib/util";

export const SiteConfigPanel = ({ site } : { site: Accessor<Site | null> }) => {
	const [siteRegions, { refetch }] = createResource(async () => {
		return loadRegionsForSite(expect(site()).id);
	});

	const isRegionActive = (regionId: RegionId) => {
		const r = siteRegions();
		if (r == null) return true; // Region settings not yet loaded

		const defaultValue = site()!.regions.find(region => region.id === regionId)?.default ?? true;
		console.log(regionId, defaultValue);
		return r.regionEnabledOverride[regionId] ?? defaultValue;
	}

	const id = (region: { id: string }) => `region-toggle-${region.id}`;

	return <div class="space-y-2">
		<div class="px-4 py-2 flex space-x-2 cross-end">
			<h3 class="font-xl flex-1">{expect(site()).title}</h3>
			<a class="font-sm hover:underline" target="_blank" href={`https://${expect(site()?.hosts[0])}`}>Visit site</a>
		</div>
		<ul>
			<For each={expect(site()).regions}>
				{region => <li>
					<RegionToggleButton siteId={expect(site()).id} regionId={region.id} refetch={refetch} value={() => isRegionActive(region.id)} label={region.title} />
				</li>}
			</For>
		</ul>
	</div>
}

const RegionToggleButton = ({siteId, regionId, label, value, refetch}: { siteId: SiteId, regionId: RegionId, label: string, value: Accessor<boolean>, refetch: () => void }) => {
	const toggle = async () => {
		await setRegionEnabledForSite(siteId, regionId, !value());
		refetch();
		await sendToServiceWorker({
			type: 'notifyOptionsUpdated',
		})
	}

	const id = () => `region-toggle-${regionId}`;

	return <label for={id()} class="flex cursor-pointer hover:bg-lighten-100 px-4">
		<input id={id()} type="checkbox" class="toggle" onClick={toggle} checked={value()} />
		<span class="flex-1 px-2 py-1">{ label }</span>
	</label>
}
