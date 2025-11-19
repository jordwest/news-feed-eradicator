import { enabledStatus } from './is-enabled';
import { Store } from '../store';

// Unforunately the browser provides no native way to observe route changes initiated
// by the page. The `popstate` event only observes browser initiated back/forward events.
// So, we resort to this hack: checking the document URL every n milliseconds, to see if
// it's changed.
// NB: I also tried monkey patching history.pushState to intercept the calls, but that
// had no effect.
const CHECK_INTERVAL = 1000;

let lastPath: string | undefined = undefined;
let element = document.querySelector('html');

export function setupRouteChange(store: Store) {
	const updateEnabledStatus = (): any => {
		const settings = store.getState().settings;
		if (settings == null) {
			// Settings not loaded yet, we need them to check if this site is enabled
			setTimeout(updateEnabledStatus, 100);
			return;
		}

		const status = enabledStatus(settings);
		switch (status.type) {
			case 'enabled':
				element!.dataset.nfeEnabled = 'true';
				// Scroll back to top when reenabled
				setTimeout(() => window.scrollTo(0, 0), 100);
				return;
			case 'disabled':
				// Delay showing the feed when switching pages, sometimes it can appear
				// before the page has switched
				//
				// Removed for now as this was causing issues when loading twitter. When
				// it's disabled then enabled immediately after, the timeout still hangs around
				// for a second and eventually disables it.
				// setTimeout(() => {
				// 	element!.dataset.nfeEnabled = 'false';
				// }, 1000);

				element!.dataset.nfeEnabled = 'false';
				return;
			case 'disabled-temporarily':
				element!.dataset.nfeEnabled = 'false';
				const remainingTime = status.until - Date.now();
				const checkAgainDelay = remainingTime > 60000 ? 60000 : remainingTime;
				setTimeout(updateEnabledStatus, checkAgainDelay);
		}
	};

	let timer: NodeJS.Timer | undefined = undefined;
	const checkIfLocationChanged = () => {
		let path = document.location.pathname;
		if (path != lastPath) {
			lastPath = path;
			updateEnabledStatus();
		}
		if (timer != null) {
			clearTimeout(timer);
		}
		timer = setTimeout(checkIfLocationChanged, CHECK_INTERVAL);
	};
	window.addEventListener('popstate', checkIfLocationChanged);

	// When the store changes, we might want to check if the enabled state has changed
	store.subscribe(() => {
		updateEnabledStatus();
	});

	checkIfLocationChanged();
}
