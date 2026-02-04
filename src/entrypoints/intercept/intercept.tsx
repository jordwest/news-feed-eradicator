// Injected into the relevant site
import { getBrowser } from '../../lib/webextension';
import type { FromServiceWorkerMessage, DesiredRegionState, ToServiceWorkerMessage } from '../../messaging/messages';
import { QuoteWidget } from '../../shared/quote-widget';
import type { Region, RegionId, Site, SiteId } from '../../types/sitelist';
import { render } from 'solid-js/web';
import nfeStyles from './nfe-container.css?raw';
import sharedStyles from '../../shared/styles.css?raw';
import type { Theme } from '../../storage/schema';
import { signalObj, type SignalObj } from '/lib/solid-util';

const browser = getBrowser();

const token = Math.floor(Math.random() * 1000000);

const sendMessage = (message: ToServiceWorkerMessage) => browser.runtime.sendMessage(message);

type RegionState = {
	config: Region;
	injectedElement?: HTMLDivElement;
	css?: string;
	enabled?: boolean;
};

type OverlayState = {
	referenceElement: Element;
	overlayContainer: HTMLDivElement;
};

type ContentScriptState = {
	snoozeUntil?: number;
	snoozeTimer?: Timer;
	injectedCss?: string | null;
	injectedPageStyleElement?: HTMLStyleElement;
	injectedThemeStyleElement?: HTMLStyleElement;
	siteId?: SiteId;
	ready?: boolean;
	hideQuotes?: boolean;
	widgetStyle: SignalObj<'contained' | 'transparent'>;
	overlays: OverlayState[];
	theme: {
		css: string | null;
		id: SignalObj<Theme | null>;
	}
	regions: Map<RegionId, RegionState>;
};

let state: ContentScriptState = {
	regions: new Map(),
	overlays: [],
	widgetStyle: signalObj<'contained' | 'transparent'>('contained'),
	theme: {
		css: null,
		id: signalObj<Theme | null>(null),
	}
};

function createOverlay(refEl: Element, el: Element, bounds: DOMRect, position: 'fixed' | 'absolute', zIndex: number) {
	const overlay = document.createElement('div');
	const overlayState = {
		referenceElement: refEl,
		overlayContainer: overlay,
	};
	overlay.id = 'nfe-overlay';
	overlay.style.position = position;
	overlay.style.zIndex = `${zIndex}`;
	overlay.style.pointerEvents = 'none';
	updateOverlay(overlayState);
	state.overlays.push(overlayState);
	document.body.appendChild(overlay);
	overlay.appendChild(el);
}

function updateOverlay(overlay: OverlayState) {
	const refBounds = overlay.referenceElement.getBoundingClientRect();
	const bounds = overlay.overlayContainer.getBoundingClientRect();
	if (refBounds.width !== bounds.width || refBounds.height !== bounds.height) {
		overlay.overlayContainer.style.width = `${refBounds.width}px`;
		overlay.overlayContainer.style.height = `${refBounds.height}px`;
	}
	if (refBounds.top !== bounds.top || refBounds.left !== bounds.left) {
		overlay.overlayContainer.style.top = `${refBounds.top}px`;
		overlay.overlayContainer.style.left = `${refBounds.left}px`;
	}
}

/**
 * Check the DOM ongoing to see if any injected elements need to be updated
 */
function checkDom() {
	for (const overlay of state.overlays) {
		updateOverlay(overlay);
	}
}

window.addEventListener("resize", checkDom)
setInterval(checkDom, 1000);

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
			const el = document.querySelector(selector);
			if (el == null) {
				// Element not found
				isMissingElements = true;
				continue;
			}
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
					createOverlay(el, nfeElement, bounds, 'absolute', injectConfig.overlayZIndex ?? 99999999);
					break;
				}
				case 'overlay-fixed': {
					const bounds = el.getBoundingClientRect();
					createOverlay(el, nfeElement, bounds, 'fixed', injectConfig.overlayZIndex ?? 99999999);
					break;
				}
				default:
					throw new Error(`Invalid value for insertAt: ${injectConfig.mode}`)
			}

			const shadow = nfeElement.attachShadow({ mode: "open" });

			state.injectedThemeStyleElement = document.createElement('style');
			state.injectedThemeStyleElement.textContent = state.theme.css?.replace(':root', ':host') ?? '';
			shadow.appendChild(state.injectedThemeStyleElement);

			const style = document.createElement('style');
			style.textContent = `${nfeStyles}\n${sharedStyles}`;
			shadow.appendChild(style);

			const container = document.createElement('div')
			container.id = 'nfe-container';
			container.className = 'dark';
			shadow.appendChild(container);

			render(() => <QuoteWidget siteId={state.siteId ?? null} theme={state.theme.id.get} widgetStyle={state.widgetStyle.get} />, container);

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

		sendMessage({
			type: 'requestSiteDetails',
			path: window.location.pathname,
			token
		});
	}
}, 15);

const setCss = async (css: string | null) => {
	if (state.injectedPageStyleElement == null) {
		state.injectedPageStyleElement = document.createElement('style');
		document.head.appendChild(state.injectedPageStyleElement);
	}

	state.injectedPageStyleElement.textContent = css ?? '';
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

	if (state.injectedThemeStyleElement != null) {
		state.injectedThemeStyleElement.textContent = state.theme.css?.replace(':root', ':host') ?? '';
	}

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

		if (activeRegion.injectedElement == null && activeRegion.config.inject != null && !state.hideQuotes) {
			setTimeout(tryInject, 1);
		} else if (activeRegion.injectedElement != null) {
			const el = activeRegion.injectedElement;

			el.style.display = isRegionBlockActive(activeRegion) && !state.hideQuotes ? 'block' : 'none';
		}

		if (activeRegion.css != null && activeRegion.enabled) {
			css += activeRegion.css + '\n';
		}
	}

	setCss(css);
}

const isRegionBlockActive = (region: RegionState) => region.enabled && !isSnoozing()

browser.runtime.onMessage.addListener(async (msg: FromServiceWorkerMessage) => {
	if (msg.type == 'nfe#siteDetails' && msg.token === token) {
		if (msg.snoozeUntil != null && msg.snoozeUntil > Date.now()) {
			setSnoozeTimer(msg.snoozeUntil);
		} else {
			setSnoozeTimer(null);
		}

		state.ready = true;
		state.siteId = msg.siteId;
		state.theme.css = msg.theme.css;
		state.hideQuotes = msg.hideQuotes;
		state.widgetStyle.set(msg.widgetStyle);
		state.theme.id.set(msg.theme.id);
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
