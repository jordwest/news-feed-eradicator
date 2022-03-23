import injectUI, { isAlreadyInjected } from '../lib/inject-ui';
import { isEnabled } from '../lib/is-enabled';
import { Store } from '../store';

export function checkSite(): boolean {
	return window.location.host.includes('github.com');
}

export function eradicate(store: Store) {
	function eradicateRetry() {
		const settings = store.getState().settings;
		if (!settings || !isEnabled(settings)) {
			return;
		}

		const dashboard = <HTMLElement>document.querySelector('#dashboard');
		if (dashboard) {
			dashboard.style.setProperty('display', 'none', 'important');
		} else {
			return;
		}

		const exploreRepositories = <HTMLElement>document.querySelector('[aria-label="Explore"]');
		if (exploreRepositories) {
			exploreRepositories.style.setProperty('display', 'none', 'important');
		}

		const injectContainerId = 'news-feed-eradicator-inject-container';
		let injectContainer = document.getElementById(injectContainerId);
		if (!injectContainer) {
			injectContainer = document.createElement('div');
			injectContainer.id = injectContainerId;
			injectContainer.style.paddingTop = '20px';
			injectContainer.style.paddingBottom = '20px';
			dashboard.after(injectContainer);
		}

		// Add News Feed Eradicator quote/info panel
		if (!isAlreadyInjected()) {
			injectUI(injectContainer, store);
		}
	}

	// This delay ensures that the elements have been created by Twitter's
	// scripts before we attempt to replace them
	setInterval(eradicateRetry, 1000);
}
