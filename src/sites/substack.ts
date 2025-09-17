import injectUI, { isAlreadyInjected } from '../lib/inject-ui';
import { isEnabled } from '../lib/is-enabled';
import { Store } from '../store';
import { injectCSS } from "./shared";

export function checkSite(): boolean {
    console.log(window.location.host)
    console.log('waaa', window.location.host.includes('substack.com'))
    return window.location.host.includes('substack.com');
}

export function eradicate(store: Store) {
    function eradicateRetry() {
        injectCSS('substack');

        const settings = store.getState().settings;
        if (settings == null || !isEnabled(settings)) {
            return;
        }

        // Don't do anything if the UI hasn't loaded yet
        const feed = document.querySelector('div[aria-label="Notes feed"]');
        console.log("feed?")
        if (feed == null) {
            return;
        }

        const container = feed;

        // Add News Feed Eradicator quote/info panel
        if (feed && !isAlreadyInjected()) {
            injectUI(feed, store, { asFirstChild: true });
        }
    }

    // This delay ensures that the elements have been created by Linkedin's
    // scripts before we attempt to replace them
    setInterval(eradicateRetry, 1000);
}
