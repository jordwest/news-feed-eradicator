// Injected into the relevant site
import { getBrowser } from '../../lib/webextension';
import type { Feed } from '../../types/sitelist';

const browser = getBrowser();

console.log('Injecting NFE 3')

const token = Math.floor(Math.random() * 1000000);

console.log('runtime', browser.runtime);
const port = browser.runtime.connect();

let hasConfirmedToken = false;

type FeedInjectState = {
	type: 'waiting',
} | {
	type: 'searching',
	feed: Feed,
} | { type: 'injected' };

function createOverlay(el: Element, bounds: DOMRect, position: string) {
	const overlay = document.createElement('div');
	overlay.id = 'nfe-overlay';
	overlay.style.position = position;
	overlay.style.width = `${bounds.width}px`;
	overlay.style.height = `${bounds.height}px`;
	overlay.style.zIndex = '999999999';
	overlay.style.pointerEvents = 'none';
	overlay.style.top = `${bounds.top}px`;
	overlay.style.left = `${bounds.left}px`;
	document.body.appendChild(overlay);
	overlay.appendChild(el);
}

let feedState: FeedInjectState = { type: 'waiting' };

function checkFeed() {
	if (feedState.type === 'searching') {
		for (const selector of feedState.feed.selectors) {
			console.log('Trying selector', selector);

			const el = document.querySelector(selector);
			if (el != null) {
				console.log('Found', el);

				const nfeElement = document.createElement('div');
				nfeElement.id = 'nfe-container'
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
						createOverlay(nfeElement, bounds, 'absolute');
						break;
					}
					case 'overlay-fixed': {
						const bounds = el.getBoundingClientRect();
						createOverlay(nfeElement, bounds, 'fixed');
						break;
					}
					default:
						throw new Error(`Invalid value for insertAt: ${feedState.feed.insertAt}`)
				}

				const shadow = nfeElement.attachShadow({ mode: "open" });
				const style = document.createElement('style');
				style.textContent = `
					* {
						background-color: #000;
						font-size: 24px;
						color: white;
					}
				`;
				shadow.appendChild(style);

				const container = document.createElement('div')
				container.textContent = "News Feed Eradicator";
				shadow.appendChild(container);

				return
			}
		}

		// Feed not found, check again
		setTimeout(checkFeed, 100);
	}
}

browser.runtime.onMessage.addListener((msg) => {
	console.log("Got message", msg);
	if (msg.token === token && !hasConfirmedToken) {
		hasConfirmedToken = true;
		console.log('Confirmed token');
		port.postMessage({ type: 'injectCSS', token });
	}

	if (msg.type === 'injectFeed') {
		const feedInfo: Feed = msg.feed;

		feedState = { type: 'searching', feed: feedInfo };
		checkFeed();
	}
})

port.postMessage({ type: 'scriptInjected', token });

// const style = document.createElement('style');
// style.textContent = 'body { background-color: red !important; }';
// document.addEventListener('DOMContentLoaded', () => {
// 	document.head.append(style);
// });

// console.log(style);
