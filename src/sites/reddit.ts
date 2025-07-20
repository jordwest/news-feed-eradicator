import injectUI, { isAlreadyInjected } from '../lib/inject-ui';
import { isEnabled } from '../lib/is-enabled';
import { Store } from '../store';

export function checkSite(): boolean {
	return window.location.host.includes('reddit.com');
}

export function eradicate(store: Store) {
	function eradicateRetry() {       
		const settings = store.getState().settings;
		if (settings == null || !isEnabled(settings)) {

			return;
		}

        // Don't do anything if we're on a subreddit feed -- Only the main Reddit feed should be affected
        const isSubredditFeed =
            window.location.pathname.startsWith('/r/') &&
            !window.location.pathname.startsWith('/r/all') &&
            !window.location.pathname.startsWith('/r/popular');

        if (isSubredditFeed) {
            // Disable eradication CSS
            document.documentElement.setAttribute('data-nfe-enabled', 'false');
            return;
        }

		// Don't do anything if the UI hasn't loaded yet
		const scroll_item = document.querySelector('.scrollerItem');

		const new_new_reddit_container = document.querySelector('shreddit-feed');
		const new_reddit_container =
			scroll_item?.parentNode?.parentNode?.parentNode?.previousSibling;
		const old_reddit_container = document.querySelector(
			'.listing-page > .content'
		);
		const container =
			new_new_reddit_container || new_reddit_container || old_reddit_container;

		if (container == null) {
			return;
		}

		// Add News Feed Eradicator quote/info panel
		if (!isAlreadyInjected()) {
			// Hack so that injectUI can handle new-reddit theme
            document.body.style.background = 'var(--newRedditTheme-body)';
            document.documentElement.setAttribute('data-nfe-enabled', 'true');
            injectUI(container, store, { asFirstChild: true });
		}
	}

	// This delay ensures that the elements have been created by Reddit's
	// scripts before we attempt to replace them
	setInterval(eradicateRetry, 1000);
}
