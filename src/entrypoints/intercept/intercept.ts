// Injected into the relevant site
import NewsFeedEradicator from '../../../src-old/components';
import { getBrowser } from '../../lib/webextension';
import type { ContentScriptMessage, ServiceWorkerMessage } from '../../messaging/messages';
import type { Feed } from '../../types/sitelist';
import nfeStyles from './nfe-container.css' with { type: 'text' };

const browser = getBrowser();

console.log('Injecting NFE 3')

const token = Math.floor(Math.random() * 1000000);

console.log('runtime', browser.runtime);
// const port = browser.runtime.connect();
const sendMessage = (message: ContentScriptMessage) => browser.runtime.sendMessage(message);

type ContentScriptState = {
	feed?: Feed | null;
	snoozeUntil?: number;
	snoozeTimer?: Timer;
};
let state: ContentScriptState = {};

type FeedInjectState = {
	type: 'waiting',
} | {
	type: 'searching',
	feed: Feed,
} | { type: 'injected', el: HTMLDivElement } | { type: 'not-injected' };

function createOverlay(el: Element, bounds: DOMRect, position: string, zIndex: number) {
	const overlay = document.createElement('div');
	overlay.id = 'nfe-overlay';
	overlay.style.position = position;
	overlay.style.width = `${bounds.width}px`;
	overlay.style.height = `${bounds.height}px`;
	overlay.style.zIndex = `${zIndex}`;
	overlay.style.pointerEvents = 'none';
	overlay.style.top = `${bounds.top}px`;
	overlay.style.left = `${bounds.left}px`;
	document.body.appendChild(overlay);
	overlay.appendChild(el);
}

let feedState: FeedInjectState = { type: 'waiting' };

let injectedCss: string | null = null;

function checkFeed() {
	if (feedState.type === 'searching') {
		for (const selector of feedState.feed.selectors) {
			console.log('Trying selector', selector);

			const el = document.querySelector(selector);
			if (el != null) {
				console.log('Found', el);

				const nfeElement = document.createElement('div');
				nfeElement.id = 'nfe-root'
				switch (feedState.feed.insertAt) {
					case 'firstChild':
						el.prepend(nfeElement);
						break;
					case 'lastChild':
						el.appendChild(nfeElement);
						break;
					case 'before':
						// el.parentElement?.insertBefore(nfeElement, el)
						el.before(nfeElement)
						break;
					case 'after':
						el.after('afterend')
						break;
					case 'overlay': {
						const bounds = el.getBoundingClientRect();
						createOverlay(nfeElement, bounds, 'absolute', feedState.feed.overlayZIndex ?? 99999999);
						break;
					}
					case 'overlay-fixed': {
						const bounds = el.getBoundingClientRect();
						createOverlay(nfeElement, bounds, 'fixed', feedState.feed.overlayZIndex ?? 99999999);
						break;
					}
					default:
						throw new Error(`Invalid value for insertAt: ${feedState.feed.insertAt}`)
				}

				const shadow = nfeElement.attachShadow({ mode: "open" });
				const style = document.createElement('style');
				style.textContent = nfeStyles;
				shadow.appendChild(style);

				const container = document.createElement('div')
				container.id = 'nfe-container';
				container.textContent = "News Feed Eradicator";
				shadow.appendChild(container);

				nfeElement.style.display = isSnoozing() ? 'none' : 'block';

				feedState = {
					type: 'injected',
					el: nfeElement,
				}

				return
			}
		}

		// Feed not found, check again
		setTimeout(checkFeed, 100);
	}
}

let path = window.location.pathname;
setInterval(() => {
	if (path != window.location.pathname) {
		path = window.location.pathname;

		console.log('path changed', path);

		sendMessage({
			type: 'requestSiteDetails',
			path: window.location.pathname,
			token
		});
	}
}, 15);

const setCss = async (css: string | null) => {
	if (css === injectedCss) {
		return;
	}

	// Remove any existing css first
	if (injectedCss != null) {
		const removed = await sendMessage({ type: 'removeCss', css: injectedCss });
		console.log('got response remove', removed)
		injectedCss = null;
	}

	// Inject new css
	if (css != null) {
		injectedCss = css;

		const injected = await sendMessage({ type: 'injectCss', css });
		console.log('got response injected', injected)
	}
}

const endSnooze = () => {
	sendMessage({
		type: 'requestSiteDetails',
		path: window.location.pathname,
		token
	});
	state.snoozeTimer = undefined;
}

const isSnoozing = () => {
	return state.snoozeUntil != null && state.snoozeUntil > Date.now();
}

const setSnoozeTimer = (snoozeUntil: number | null) => {
	state.snoozeUntil = snoozeUntil ?? undefined;

	if (state.snoozeTimer != null) {
		clearTimeout(state.snoozeTimer);
	}

	if (snoozeUntil != null) {
		const delay = snoozeUntil - Date.now();
		state.snoozeTimer = setTimeout(() => endSnooze(), delay);
	}
}

browser.runtime.onMessage.addListener(async (msg: ServiceWorkerMessage) => {
	console.log("Got message", msg);
	if (msg.type == 'nfe#siteDetails' && msg.token === token) {
		if (msg.snoozeUntil != null && msg.snoozeUntil > Date.now()) {
			setSnoozeTimer(msg.snoozeUntil);
			await setCss(null);
		} else {
			setSnoozeTimer(null);
			await setCss(msg.css);
		}

		state.feed = msg.feed;

		if (feedState.type === 'waiting') {
			feedState = msg.feed == null ? { type: 'not-injected' } : { type: 'searching', feed: msg.feed };
			checkFeed();
		} else if (feedState.type === 'injected') {
			const showNfe = msg.css != null && !isSnoozing();
			feedState.el.style.display = showNfe ? 'block' : 'none';
		}
	}

	if (msg.type === 'nfe#optionsUpdated') {
		sendMessage({
			type: 'requestSiteDetails',
			path: window.location.pathname,
			token
		});
	}
})

/*
 * Keep pinging service worker for site details until we receive a response. This might be delayed because
 * on Chrome at least the service worker tries to send a message to the tab while the user is still typing,
 * and the tab might show the previous site (which is not this content script).
 */
const pingServiceWorker = () => {
	if (feedState.type !== 'waiting') {
		return;
	}

	sendMessage({
		type: 'requestSiteDetails',
		path: window.location.pathname,
		token
	});

	setTimeout(pingServiceWorker, 10);
}

pingServiceWorker();
