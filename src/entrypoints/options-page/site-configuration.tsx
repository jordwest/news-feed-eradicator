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

	return <div class="p-2">
		<h3>{ expect(site()).title }</h3>
		<ul>
			<For each={expect(site()).regions}>
				{region => <li>
					<RegionToggleButton siteId={expect(site()).id} regionId={region.id} refetch={refetch} value={() => isRegionActive(region.id)} />
					{ region.title }
				</li>}
			</For>
		</ul>
	</div>
}

const RegionToggleButton = ({siteId, regionId, value, refetch}: { siteId: SiteId, regionId: RegionId, value: Accessor<boolean>, refetch: () => void }) => {
	const toggle = async () => {
		await setRegionEnabledForSite(siteId, regionId, !value());
		refetch();
		await sendToServiceWorker({
			type: 'notifyOptionsUpdated',
		})
	}
	return <input type="checkbox" class="toggle" onClick={toggle} checked={value()} />
}
