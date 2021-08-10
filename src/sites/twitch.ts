import injectUI, { isAlreadyInjected } from '../lib/inject-ui';
import { isEnabled } from '../lib/is-enabled';
import { Store } from '../store';

export function checkSite(): boolean {
	return window.location.host.includes('twitch.tv');
}

export function eradicate(store: Store) {
	function eradicateRetry() {
		const settings = store.getState().settings;
		if (settings == null || !isEnabled(settings)) {
			return;
		}

		// Don't do anything if the UI hasn't loaded yet
		const feed = document.querySelector('main');
		if (feed == null) {
			return;
		}

		const container = feed;

		// Add News Feed Eradicator quote/info panel
		if (feed && !isAlreadyInjected()) {
			injectUI(feed, store);
		}

		// Pause featured stream that auto-plays, or sounds from stream will still be audible with no visible DOM to pause video
		const pauseButton = document.querySelector(
			'[data-a-target=player-play-pause-button]'
		) as HTMLButtonElement | undefined;
		if (pauseButton?.attributes['data-a-player-state']?.value === 'playing') {
			pauseButton?.click();
		}
	}

	// This delay ensures that the elements have been created by Twitter's
	// scripts before we attempt to replace them
	setInterval(eradicateRetry, 1000);
}
