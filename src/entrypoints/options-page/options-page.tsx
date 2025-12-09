import { getBrowser, type Permissions } from "../../lib/webextension";

import { render } from "solid-js/web";
import h from "solid-js/h";
import { createSignal, For, createResource, createMemo, Show } from "solid-js";

import { type SiteList, type Site, type SiteId } from "../../types/sitelist";
import { originsForSite } from "../../lib/util";

const browser = getBrowser();

const [permissions, setPermissions] = createSignal<Permissions>({permissions: [], origins: []});

function reloadPermissions() {
	browser.permissions.getAll().then(setPermissions);
}

reloadPermissions();

const [siteList] = createResource<SiteList | undefined>(async () => {
	const siteListUrl = browser.runtime.getURL('sitelist.json');
	return await fetch(siteListUrl).then(siteList => siteList.json());
});

const [snoozeState, { refetch: refreshSnoozeState }] = createResource<number | null>(async () => {
	return browser.runtime.sendMessage({
		type: 'readSnooze',
	})
});

const [enabledSiteIds, { refetch: refreshEnabledSites }] = createResource(async () => {
	const scripts = await browser.scripting.getRegisteredContentScripts();
	return scripts.map(script => script.id) as SiteId[];
});
const isSiteEnabled = (site: Site) => enabledSiteIds()?.includes(site.id)

async function enableSite(site: Site) {
	const origins = originsForSite(site);

	const permissionAccepted = await browser.permissions.request({ origins, permissions: [] });

	if (!permissionAccepted) {
		return disableSite(site);
	}

	reloadPermissions();

	await browser.runtime.sendMessage({
		type: 'enableSite',
		siteId: site.id
	});

	refreshEnabledSites();
};

const disableSite = async (site: Site) => {
	const origins = originsForSite(site);
	const permissionAccepted = await browser.permissions.remove({ origins, permissions: [] });

	await browser.runtime.sendMessage({
		type: 'disableSite',
		siteId: site.id
	});

	refreshEnabledSites();
}

const Site = ({ site }: { site: Site }) => {
	return <div class="p-2">
		<span>{isSiteEnabled(site) ? 'ENABLED' : 'X'}</span>
		<span>{site.title}</span>
		<button onClick={ () => isSiteEnabled(site) ? disableSite(site) : enableSite(site) }>
			{isSiteEnabled(site) ? 'Disable' : 'Request permissions'}
		</button>
	</div>
}

const SiteList = () => {
	return <For each={siteList()?.sites}>
		{site => <Site site={site} />}
	</For>
};

const displayDuration = (duration: number): string => {
	if (duration < 60) {
		return `${Math.floor(duration)}s`;
	}

	const minutes = Math.floor(duration / 60);
	const seconds = Math.floor(duration - (minutes * 60));
	return `${minutes}m ${seconds}s`;
}

const Snooze = () => {
	const [now, setNow] = createSignal(Date.now());
	const [buttonHeldSince, setButtonHeldSince] = createSignal<number | null>(null);

	const timeHeld = createMemo(() => {
		const since = buttonHeldSince();
		if (since == null) return null;

		return Math.round((now() - since) / 100) / 10;
	});

	const snoozeTime = createMemo(() => {
		const holdTime = timeHeld();
		if (holdTime == null) return null;

		if (holdTime < 5) {
			return 0;
		}

		if (holdTime < 60) {
			return 30 + Math.round((holdTime - 5) * 5);
		}

		return 30 + (55 * 5) + Math.round((holdTime - 60) * 20);
	});

	setInterval(() => {
		setNow(Date.now());
	}, 100)

	const buttonDown = () => {
		setButtonHeldSince(now());
	};

	const buttonUp = async () => {
		const duration = snoozeTime();
		if (duration != null && duration > 0) {
			await browser.runtime.sendMessage({
				type: 'snooze',
				until: Date.now() + 1000 * duration,
			})
			refreshSnoozeState();
		}
		setButtonHeldSince(null);
	};

	const cancelSnooze = async () => {
		await browser.runtime.sendMessage({
			type: 'snooze',
			until: Date.now(),
		})
		refreshSnoozeState();
	};

	const isSnoozing = () => {
		const state = snoozeState();
		return state != null && state > now();
	}

	return <div>
		<div>{snoozeState() == null || snoozeState()! <= now() ? 'Hold button below to snooze' : `Snoozing for ${displayDuration((snoozeState()! - now()) / 1000)}`}</div>

		<Show when={!isSnoozing()}>
			<button class="font-lg" onMouseDown={buttonDown} onMouseUp={buttonUp} onMouseLeave={buttonUp}>
				{snoozeTime() == null ? 'Hold to Snooze' : `Snooze for ${displayDuration(snoozeTime()!)}s` }
			</button>
		</Show>
		<Show when={isSnoozing()}>
			<button class="font-lg" onClick={cancelSnooze}>
				Cancel snooze
			</button>
		</Show>
	</div>
}

const OptionsPage = () => {
	return <div class="font-lg">
		<h1>Options</h1>
		<Snooze />
		<SiteList />
	</div>
}

render(h(OptionsPage), document.querySelector("#root")!);
