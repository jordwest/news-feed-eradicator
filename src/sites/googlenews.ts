import injectUI, { isAlreadyInjected } from '../lib/inject-ui';
import { remove } from '../lib/remove-news-feed';
import { isEnabled } from '../lib/is-enabled';
import { Store } from '../store';

export function checkSite(): boolean {
	return window.location.host.includes('news.google.com');
}

export function eradicate(store: Store) {
	function eradicateRetry() {
		const settings = store.getState().settings;
		if (settings == null || !isEnabled(settings)) {
			return;
		}
        const feedIdentifier = 'div.FVeGwb';
		const feed = document.querySelector(feedIdentifier);

		// Don't do anything if the UI hasn't loaded yet
		if (feed == null) {
			return;
		}
        // The sidebar allows navigation to `/topic/<HASHED_TOPIC>'
        // Which is hard to make a rule to block for. So
        // instead just remove the sidebar.
        const sidebarIdentifier = 'div.gb_Ic';
        remove({toEmpty:[sidebarIdentifier]})

		const container = feed;

		// Add News Feed Eradicator quote/info panel
		if (container && !isAlreadyInjected()) {
			injectUI(container, store);
		}
	}

  // This delay ensures that the elements have been created before we attempt
  // to replace them
    setInterval(eradicateRetry, 1000);
}
