import injectUI, { isAlreadyInjected } from '../lib/inject-ui';
import { isEnabled } from '../lib/is-enabled';
import { Store } from '../store';
import { injectCSS } from "./shared";

export function checkSite(): boolean {
    return window.location.host.includes('substack.com');
}

export function eradicate(store: Store) {
    function eradicateRetry() {
        injectCSS('substack');

        const settings = store.getState().settings;
        if (settings == null || !isEnabled(settings)) {
            return;
        }

        const container = document.querySelector('div[aria-label="Notes feed"]');
        if (container == null) {
            return;
        }

        // Add News Feed Eradicator quote/info panel
        if (container && !isAlreadyInjected()) {
            injectUI(container, store, { asFirstChild: true });
        }
    }

    // This delay ensures that the elements have been created by Linkedin's
    // scripts before we attempt to replace them
    setInterval(eradicateRetry, 1000);
}
