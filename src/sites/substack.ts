import injectUI, { isAlreadyInjected } from '../lib/inject-ui';
import { isEnabled } from '../lib/is-enabled';
import { Store } from '../store';
import { injectCSS } from './shared';

const FEED_SELECTORS = [
	'[data-testid="homepage-feed"]',
	'.homepage-feed',
	'.feed-container',
	'.post-preview-list',
	'.reader2-main',
	'main[data-testid="post-list"]',
	'#reader-nav-page-scroll',
	'.reader-nav-page-scroll',
	'.publication-home-page',
	'[data-component="PostList"]',
	'.post-list',
];

const SUBSTACK_HOSTS = new Set(['substack.com', 'www.substack.com']);

export function checkSite(): boolean {
	const host = window.location.host;
	return (
		SUBSTACK_HOSTS.has(host) ||
		host.endsWith('.substack.com')
	);
}

function findFeedContainer(): HTMLElement | null {
	for (const selector of FEED_SELECTORS) {
		const element = document.querySelector(selector);
		if (element instanceof HTMLElement && element.isConnected) {
			return element;
		}
	}

	return null;
}

function markFeedContainer(feed: HTMLElement) {
	if (feed.dataset.nfeFeed !== 'true') {
		feed.dataset.nfeFeed = 'true';
	}
}

function hideFeedChildren(feed: HTMLElement) {
	const children = Array.from(feed.children);
	for (const child of children) {
		if (!(child instanceof HTMLElement)) {
			continue;
		}

		if (child.id === 'nfe-container') {
			delete child.dataset.nfeHidden;
			continue;
		}

		child.dataset.nfeHidden = 'true';
	}
}

function ensureQuoteContainer(feed: HTMLElement, store: Store) {
	const existing = document.getElementById('nfe-container');

	if (existing instanceof HTMLElement) {
		if (existing.parentElement !== feed) {
			feed.prepend(existing);
		} else if (existing.previousElementSibling != null) {
			feed.insertBefore(existing, feed.firstElementChild);
		}
		return;
	}

	injectUI(feed, store, { asFirstChild: true });
}

function ensureSiteContext() {
	const { body } = document;
	if (body && body.dataset.nfeSite !== 'substack') {
		body.dataset.nfeSite = 'substack';
	}
}

export function eradicate(store: Store) {
	injectCSS('substack');

	function eradicateRetry() {
		const settings = store.getState().settings;
		if (settings == null || !isEnabled(settings)) {
			return;
		}

		ensureSiteContext();

		const feed = findFeedContainer();
		if (feed == null) {
			return;
		}

		markFeedContainer(feed);
		ensureQuoteContainer(feed, store);
		hideFeedChildren(feed);
	}

	setInterval(eradicateRetry, 1000);
}
