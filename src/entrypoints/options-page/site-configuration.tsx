import { createResource, For, Show, type Accessor } from "solid-js";
import type { RegionId, Site, SiteId } from "../../types/sitelist";
import { loadRegionsForSite, loadSitelist, setRegionEnabledForSite } from "../../storage/storage";
import { sendToServiceWorker } from "../../messaging/messages";

export const SiteConfigPanel = ({ site } : { site: Site }) => {
	const [siteRegions, { refetch }] = createResource(async () => {
		return loadRegionsForSite(site.id);
	});

	const isRegionActive = (regionId: RegionId) => {
		const r = siteRegions();
		if (r == null) return true; // Region settings not yet loaded

		const defaultValue = site.regions.find(region => region.id === regionId)?.default ?? true;
		console.log(regionId, defaultValue);
		return r.regionEnabledOverride[regionId] ?? defaultValue;
	}

	return <div>
		<ul>
			<For each={site.regions}>
				{region => <li>
					<RegionToggleButton siteId={site.id} regionId={region.id} refetch={refetch} value={() => isRegionActive(region.id)} />
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
	return <button onClick={toggle}>{ value() ? '✅' : '❌' }</button>
}
