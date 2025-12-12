// Injected into the relevant site
import { getBrowser } from '../../lib/webextension';
import type { FromServiceWorkerMessage, DesiredRegionState, ToServiceWorkerMessage } from '../../messaging/messages';
import { QuoteWidget } from '../../shared/quote-widget';
import type { Region, RegionId, Site, SiteId } from '../../types/sitelist';
import { render } from 'solid-js/web';
import nfeStyles from './nfe-container.css?raw';
import sharedStyles from '../../shared/styles.css?raw';
import type { Theme } from '../../storage/schema';
import { type Signal, createSignal } from 'solid-js';

const browser = getBrowser();

const token = Math.floor(Math.random() * 1000000);

const sendMessage = (message: ToServiceWorkerMessage) => browser.runtime.sendMessage(message);

type RegionState = {
	config: Region;
	injectedElement?: HTMLDivElement;
	css?: string;
	enabled?: boolean;
};

type ContentScriptState = {
	snoozeUntil?: number;
	snoozeTimer?: Timer;
	injectedCss?: string | null;
	siteId?: SiteId;
	ready?: boolean;
	theme: {
		css: string | null;
		id: Signal<Theme | null>;
	}
	regions: Map<RegionId, RegionState>;
};

let state: ContentScriptState = {
	regions: new Map(),
	theme: {
		css: null,
		id: createSignal<Theme | null>(null),
	}
};

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

/**
 * Continuously tries to inject NFE into any regions that it is not yet injected into
 */
function tryInject() {
	if (state.ready !== true) {
		return;
	}

	let isMissingElements = false;

	for (const region of state.regions.values()) {
		const injectConfig = region.config.inject;
		if (injectConfig == null) continue;

		if (region.injectedElement != null && document.contains(region.injectedElement)) {
			// Element already injected
			continue;
		}

		for (const selector of region.config.selectors) {
			console.log('Trying selector', selector);

			const el = document.querySelector(selector);
			if (el == null) {
				// Element not found
				isMissingElements = true;
				continue;
			}
			console.log('Found', el);

			const nfeElement = document.createElement('div');
			nfeElement.id = 'nfe-root'
			switch (injectConfig.mode) {
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
					createOverlay(nfeElement, bounds, 'absolute', injectConfig.overlayZIndex ?? 99999999);
					break;
				}
				case 'overlay-fixed': {
					const bounds = el.getBoundingClientRect();
					createOverlay(nfeElement, bounds, 'fixed', injectConfig.overlayZIndex ?? 99999999);
					break;
				}
				default:
					throw new Error(`Invalid value for insertAt: ${injectConfig.mode}`)
			}

			const shadow = nfeElement.attachShadow({ mode: "open" });
			const style = document.createElement('style');
			style.textContent = `${nfeStyles}\n${sharedStyles}`;
			shadow.appendChild(style);

			const container = document.createElement('div')
			container.id = 'nfe-container';
			container.className = 'dark';
			shadow.appendChild(container);

			render(() => <QuoteWidget siteId={state.siteId ?? null} theme={state.theme.id[0]} />, container);

			nfeElement.style.display = isRegionBlockActive(region) ? 'block' : 'none';

			region.injectedElement = nfeElement;
		}
	}

	if (isMissingElements) {
		// At least one region's element hasn't been found/injected yet
		setTimeout(tryInject, 1000);
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
	if (css === state.injectedCss) {
		return;
	}

	let oldCss = state.injectedCss;

	// Inject new css to avoid flashing content
	if (css != null) {
		state.injectedCss = css;

		const injected = await sendMessage({ type: 'injectCss', css });
		console.log('got response injected', injected)
	} else {
		state.injectedCss = null;
	}

	// Remove any existing css
	if (oldCss != null) {
		const removed = await sendMessage({ type: 'removeCss', css: oldCss });
		console.log('got response remove', removed)
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

/**
 * Calculate desired state from
 */
const patchState = (regions: DesiredRegionState[]) => {
	let seenRegions: Set<RegionId> = new Set();

	for (var region of regions) {
		const id = region.config.id;
		seenRegions.add(id);

		if (!state.regions.has(id)) {
			state.regions.set(id, { config: region.config });
		}

		const currentRegionState = state.regions.get(id)!;

		currentRegionState.config = region.config;
		currentRegionState.enabled = region.enabled;
		currentRegionState.css = region.css ?? undefined;
	}

	let css = "";

	css += state.theme.css ?? '';

	// Scan all active regions and delete or update them
	for (const [id, activeRegion] of state.regions.entries()) {
		// Delete regions that no longer exist
		if (!seenRegions.has(activeRegion.config.id)) {
			if (activeRegion.injectedElement ) {
				activeRegion.injectedElement.parentElement?.removeChild(activeRegion.injectedElement);
				state.regions.delete(id);

				// Done with the region, we won't see it again
				continue;
			}
		}

		if (activeRegion.injectedElement == null && activeRegion.config.inject != null) {
			setTimeout(tryInject, 1);
		} else if (activeRegion.injectedElement != null) {
			const el = activeRegion.injectedElement;

			el.style.display = isRegionBlockActive(activeRegion) ? 'block' : 'none';
		}

		if (activeRegion.css != null && activeRegion.enabled) {
			css += activeRegion.css + '\n';
		}
	}

	console.log('css', css);
	setCss(css);
}

const isRegionBlockActive = (region: RegionState) => region.enabled && !isSnoozing()

browser.runtime.onMessage.addListener(async (msg: FromServiceWorkerMessage) => {
	console.log("Got message", msg);
	if (msg.type == 'nfe#siteDetails' && msg.token === token) {
		if (msg.snoozeUntil != null && msg.snoozeUntil > Date.now()) {
			setSnoozeTimer(msg.snoozeUntil);
		} else {
			setSnoozeTimer(null);
		}

		state.ready = true;
		state.siteId = msg.siteId;
		state.theme.css = msg.theme.css;
		state.theme.id[1](msg.theme.id);
		patchState(msg.regions);
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
	if (state.ready) {
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
