import { createResource } from "solid-js"
import { getBrowser } from "/lib/webextension";

export const DebugTabContent = () => {
	const browser = getBrowser();

	const [storage, { refetch }] = createResource(() => browser.storage.local.get(null));

	return <div class="p-4 space-y-2">
		<div class="flex cross-center">
			<h3 class="flex-1 font-bold font-lg">Storage content</h3>
			<button class="primary" onClick={refetch}>Refresh</button>
		</div>
		<pre class="viewport-scroller card outlined">
			{JSON.stringify(storage(), null, 2)}
		</pre>
	</div>
}
