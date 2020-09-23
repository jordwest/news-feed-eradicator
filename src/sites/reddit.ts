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

        // Don't do anything if the UI hasn't loaded yet
        const scroll_item = document.querySelector(
            '.scrollerItem'
        );

        if (scroll_item == null) {
            console.log('not ready yet');
            return;
        }

        const container = scroll_item.parentNode?.parentNode?.parentNode?.previousSibling;

        // Add News Feed Eradicator quote/info panel
        if (container && !isAlreadyInjected()) {
            injectUI(container, store);
        }
    }

    // This delay ensures that the elements have been created by Reddit's
    // scripts before we attempt to replace them
    setInterval(eradicateRetry, 1000);
}
