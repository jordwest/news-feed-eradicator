import injectUI, {
	isAlreadyInjected,
} from '../lib/inject-ui';
import { isEnabled } from '../lib/is-enabled';
import { Store } from '../store';

export function checkSite(): boolean {
	return window.location.host.includes('youtube.com');
}

export function eradicate(store: Store) {
	function eradicateRetry() {
		const state = store.getState();
		const settings = state.settings;
		if (settings == null || !isEnabled(settings)) {
			return;
		}

		const feed = document.querySelector('#primary');
		const shorts = document.querySelector('#shorts-container');

    // Don't do anything if the UI hasn't loaded yet
		if (feed == null && shorts == null) {
			return;
		}

		if (feed || shorts) {
			// Hack so that injectUI can handle dark theme
			document.body.style.background = 'var(--yt-spec-general-background-a)';

      // Redirect the user to the main page and quote if they are on the shorts page
			if (shorts) {
				window.location.href = '/';
			}

      // Add News Feed Eradicator quote/info panel
			if (feed && !isAlreadyInjected()) {
				injectUI(feed, store);
			}
		}
	}

	// This delay ensures that the elements have been created before we attempt
	// to replace them
	setInterval(eradicateRetry, 1000);
}
