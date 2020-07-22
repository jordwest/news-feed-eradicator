import injectUI, { isAlreadyInjected } from '../lib/inject-ui';
import isEnabled from '../lib/is-enabled';

export function eradicate() {
	let retryInterval;

	function eradicateRetry() {
		if (!isEnabled(['/feed', '/feed/'])) {
			return;
		}

		const bootComplete = document.body.classList.contains('boot-complete');
		if (!bootComplete) {
			return;
		}

		const coreRail = document.querySelector('.core-rail');
		if (coreRail === null) {
			return;
		}

		const feed = coreRail.lastElementChild;
		if (feed == null) {
			return;
		}

		feed.classList.add('nfe-linkedin-hide');

		// Add News Feed Eradicator quote/info panel
		if (!isAlreadyInjected()) {
			clearInterval(retryInterval);

			coreRail.classList.add('nfe-loaded');

			// clear scroll event listener so that newsfeed is not
			// reloaded on scroll
			window.addEventListener('scroll', () => undefined);

			injectUI(feed);
		}
	}

	// This delay ensures that the elements have been created by LinkedIn's
	// scripts before we attempt to replace them
	retryInterval = setInterval(eradicateRetry, 1000);
}
