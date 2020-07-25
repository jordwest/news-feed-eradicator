import injectUI, { isAlreadyInjected } from '../lib/inject-ui';
import isEnabled from '../lib/is-enabled';

export function eradicate() {
	function eradicateRetry() {
		if (isAlreadyInjected()) {
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

		// clear scroll event listener so that newsfeed is not
		// reloaded on scroll
		window.addEventListener('scroll', () => undefined);

		injectUI(feed);
	}

	// This delay ensures that the elements have been created by LinkedIn's
	// scripts before we attempt to replace them
	setInterval(eradicateRetry, 1000);
}
