import { createResource, Show } from "solid-js"
import { getBrowser } from "/lib/webextension";
import { versionText } from "/lib/util";
import { loadSitelist, loadSiteListOverride, saveSiteListOverride } from "/storage/storage";
import type { SiteList } from "/types/sitelist";
import { sendToServiceWorker } from "/messaging/messages";
import { useOptionsPageState } from "../../state";

export const DebugTabContent = () => {
	const browser = getBrowser();

	const state = useOptionsPageState();

	const [storage, { refetch: refetchStorage }] = createResource(() => browser.storage.local.get(null));
	const [siteListOverride, { refetch: refetchSiteListOverride }] = createResource(loadSiteListOverride);

	let fileInput: HTMLInputElement | undefined;

	const onFileSelected = async (e: Event & { currentTarget: HTMLInputElement }) => {
		const input = e.currentTarget;
		const file = input.files?.[0];
		if (file == null) return;

		try {
			const siteList = JSON.parse(await file.text()) as SiteList;
			await saveSiteListOverride(siteList);
		} catch (err) {
			alert(`Failed to load site list: ${err}`);
		} finally {
			input.value = '';
		}

		refetchSiteListOverride();
		refetchStorage();

		state.reloadSiteList();
	};

	const clearOverride = async () => {
		await saveSiteListOverride(undefined);
		refetchSiteListOverride();
		refetchStorage();

		state.reloadSiteList();
	};

	return <div class="p-4 space-y-2">
		<div>
			Version: {versionText(state.siteList.get())}
		</div>
		<div class="flex cross-center">
			<h3 class="flex-1 font-bold font-lg">
				Custom sitelist: {siteListOverride() != null ? siteListOverride()?.buildTimestamp : 'not set'}
			</h3>
			<input
				ref={fileInput}
				type="file"
				accept="application/json,.json"
				style={{ display: "none" }}
				onChange={onFileSelected}
			/>
			<Show when={siteListOverride() != null}>
				<button class="primary" onClick={clearOverride}>Clear</button>
			</Show>
			<Show when={siteListOverride() == null}>
				<button
					class="primary"
					onClick={() => fileInput?.click()}
				>
					Load custom sitelist
				</button>
			</Show>
		</div>
		<div class="flex cross-center">
			<h3 class="flex-1 font-bold font-lg">Storage content</h3>
			<button class="primary" onClick={refetchStorage}>Refresh</button>
		</div>
		<pre class="viewport-scroller card outlined">
			{JSON.stringify(storage(), null, 2)}
		</pre>
	</div>
}
