import { PayloadAction, UnknownAction } from '@reduxjs/toolkit';
import { Effect } from '../lib/redux-effects';
import { IState } from './index';
import { currentQuote, getAvailableQuotes } from './selectors';
import { generateID } from '../lib/generate-id';
import { getBrowser } from '../webextension';
import { Message, MessageType } from '../messaging/types';
import { SiteId, Sites } from '../sites';
import {
	getSiteStatus,
	SiteStatusTag,
} from '../background/store/sites/selectors';
import { Store } from '.';
import { Settings } from '../background/store';
import { 
	backgroundSettingsChanged, 
	backgroundAction,
	setCurrentQuote,
	parseError,
	cancelEditText,
	uiOptionsShow,
	uiSitesSiteClick,
	quoteSaveClicked as quoteSaveClickedAction,
	quoteRemoveCurrent as quoteRemoveCurrentAction,
	uiSitesSiteDisableConfirmShow,
	uiSitesSiteDisableConfirmed,
	selectNewQuote as selectNewQuoteAction,
	addQuotesBulk,
} from './slices';
import {
	addCustomQuote,
	removeCustomQuote,
	checkPermissions,
	hideHiddenBuiltinQuote,
	setSiteState,
} from '../background/store/slices';
import { SiteDisabledConfirmed } from './slices/options';

export type AppEffect = Effect<IState, UnknownAction>;

// When the settings have changed, we might need to select a new quote
const refreshQuotes: AppEffect = (store) => (action) => {
	if (action.type === backgroundSettingsChanged.type) {
		// Check if current quote still exists
		const state = store.getState();
		const current = currentQuote(state);
		if (current == null) {
			store.dispatch(selectNewQuoteAction());
		}
	}
};

// Find a new quote from the database
const selectNewQuote: AppEffect = (store) => (action) => {
	if (action.type === selectNewQuoteAction.type) {
		const state = store.getState();
		if (state.settings == null) {
			throw new Error('Settings not available yet');
		}

		const allQuotes = getAvailableQuotes(state);
		if (allQuotes.length < 1) {
			return store.dispatch(
				setCurrentQuote({ type: 'none-found' }),
			);
		}

		const quoteIndex = Math.floor(Math.random() * allQuotes.length);
		store.dispatch(setCurrentQuote(allQuotes[quoteIndex]));
	}
};

// When quote is added, we can cancel editing
const quoteSaveClicked: AppEffect = (store) => (action) => {
	const state = store.getState();

	if (action.type === quoteSaveClickedAction.type) {
		// Don't do anything if quote is empty
		if (state.editingText.trim().length < 1) {
			return;
		}

		const id = generateID();
		store.dispatch(addCustomQuote({id, text: state.editingText, source: state.editingSource}));
		store.dispatch(cancelEditText()); // ? maybe cancelEditSource, cancelEditQuote
		store.dispatch(setCurrentQuote({ type: 'custom', id }));
	}
};

const quoteRemoveCurrent: AppEffect = (store) => (action) => {
	if (action.type !== quoteRemoveCurrentAction.type) return;

	const state: IState = store.getState();
	if (state.currentQuote == null || state.currentQuote.type === 'none-found') {
		return;
	} else if (state.currentQuote.type === 'custom') {
		store.dispatch(backgroundAction(removeCustomQuote(state.currentQuote.id)));
	} else {
		store.dispatch(backgroundAction(hideHiddenBuiltinQuote(state.currentQuote.id)));
	}

	store.dispatch(selectNewQuoteAction());
};

const quoteAddBulk: AppEffect = (store) => (action: PayloadAction<{text: string}>) => {
	if (action.type !== addQuotesBulk.type) return;

	const lines = action.payload.text.split('\n');
	const quotes: string[][] = [];
	for (var lineCount = 0; lineCount < lines.length; lineCount++) {
		const line = lines[lineCount];
		const quote = line.split('~');
		const trimmedQuote: string[] = [];

		if (quote.length === 0 || quote[0].trim() === '') {
			// ignore newlines and empty spaces
		} else if (quote.length !== 2) {
			return store.dispatch(
				parseError(
					`Invalid format on line ${(
						lineCount + 1
					).toString()}: \"${quote}\". Check that you have a "~" separating the quote text and the source.`,
				)
			);
		} else {
			quote.forEach((field) => trimmedQuote.push(field.trim()));
			quotes.push(trimmedQuote);
		}
	}
	quotes.forEach((trimmedQuote) =>
		store.dispatch(addCustomQuote({
			id: generateID(),
			text: trimmedQuote[0],
			source: trimmedQuote[1],
		}))
	);
	store.dispatch(cancelEditText());  // ? maybe cancelEditSource, cancelEditQuote
};

const requestPermissions = async (store: Store, origins: string[]) => {
	const success = await getBrowser().permissions.request({
		permissions: [],
		origins: origins,
	});
	if (success) {
		// Check and update permissions
		store.dispatch(backgroundAction(checkPermissions()));
	}
	return success;
};
const removePermissions = async (store: Store, origins: string[]) => {
	const success = await getBrowser().permissions.remove({
		permissions: [],
		origins: origins,
	});
	if (success) {
		// Check and update permissions
		store.dispatch(backgroundAction(checkPermissions()));
	}
	return success;
};

const siteClicked: AppEffect = (store) => async (action: PayloadAction<{ site: SiteId }>) => {
	if (action.type === uiSitesSiteClick.type) {
		const state = store.getState();
		if (state.settings == null) {
			// Can't do anything until settings have loaded
			return;
		}
		const sites = getSiteStatus(state.settings);
		const site = Sites[action.payload.site];

		const s = sites[action.payload.site];
		if (s.type == SiteStatusTag.NEEDS_NEW_PERMISSIONS) {
			if (await requestPermissions(store as Store, site.origins)) {
				store.dispatch(
					setSiteState({
						siteId: action.payload.site,
						state: {
							type: Settings.SiteStateTag.ENABLED,
						}
					})
				);
			} else {
				// Permission denied, disable the site
				store.dispatch(
					setSiteState({
						siteId: action.payload.site,
						state: {
							type: Settings.SiteStateTag.DISABLED,
						}
					})
				);
			}
		} else if (s.type === SiteStatusTag.DISABLED) {
			const success = await requestPermissions(store as Store, site.origins);
			if (success) {
				store.dispatch(
					setSiteState({
						siteId: action.payload.site, 
						state: {
							type: Settings.SiteStateTag.ENABLED,
						}
					})
				);
			}
		} else if (s.type === SiteStatusTag.DISABLED_TEMPORARILY) {
			store.dispatch(
				setSiteState({
					siteId: action.payload.site, 
					state: {
						type: Settings.SiteStateTag.ENABLED,
					}
				})
			);
		} else if (s.type === SiteStatusTag.ENABLED) {
			store.dispatch(uiSitesSiteDisableConfirmShow(action.payload.site));
			// ? store.dispatch(uiSitesSiteDisableConfirmShow(action.site));
		}
	}
};

const confirmSiteDisabled: AppEffect = (store) => async (action: PayloadAction<SiteDisabledConfirmed>) => {
	if (action.type === uiSitesSiteDisableConfirmed.type) {
		if (action.payload.until.t === 'forever') {
			// Don't need the permissions anymore
			const site = Sites[action.payload.site];
			await removePermissions(store as Store, site.origins);
			store.dispatch(
				setSiteState({
					siteId: action.payload.site,
					state: {
						type: Settings.SiteStateTag.DISABLED,
					}
				})
			);
		} else {
			store.dispatch(
				setSiteState({
					siteId: action.payload.site,
					state: {
						type: Settings.SiteStateTag.DISABLED_TEMPORARILY,
						disabled_until: Date.now() + (action.payload.until as { milliseconds: number }).milliseconds
					}
				})
			);
		}
	}
};

// Connect to the background script at startup
const connect: AppEffect = (store) => {
	const browser = getBrowser();
	const port = browser.runtime.connect();
	port.onMessage.addListener((msg: Message) => {
		if (msg.t === MessageType.SETTINGS_CHANGED) {
			store.dispatch(backgroundSettingsChanged(msg.settings));
		}
	});

	return (action) => {
		// Forward any actions to the background script
		if (action.type === backgroundAction.type) {
			port.postMessage({
				t: MessageType.SETTINGS_ACTION,
				action: action.action,
			});
		} else if (action.type === uiOptionsShow.type) {
			port.postMessage({
				t: MessageType.OPTIONS_PAGE_OPEN,
			});
		}
	};
};

export const rootEffect: AppEffect = Effect.all(
	refreshQuotes,
	selectNewQuote,
	quoteRemoveCurrent,
	quoteSaveClicked,
	quoteAddBulk,
	siteClicked,
	confirmSiteDisabled,
	connect
);
