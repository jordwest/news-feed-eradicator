import { loadRegionHideStyle, loadWidgetStyle, saveRegionHideStyle, saveWidgetStyle, loadSettingsLocked, saveSettingsLocked, loadHideQuotes, saveHideQuotes, saveNewQuoteList } from "/storage/storage";
import type { StorageLocalV2, QuoteListId } from "/storage/schema";
import { sendToServiceWorker } from "/messaging/messages";
import { createMemo, refresh } from "solid-js";

export class StorageState {
	widgetStyle = createMemo(loadWidgetStyle);
	regionHideStyle = createMemo(loadRegionHideStyle);
	settingsLocked = createMemo(loadSettingsLocked);
	hideQuotes = createMemo(loadHideQuotes);

	async setWidgetStyle(style: StorageLocalV2['widgetStyle']) {
		await saveWidgetStyle(style)
		refresh(this.widgetStyle);

		sendToServiceWorker({
			type: 'notifyOptionsUpdated',
		})
	}

	async setRegionHideStyle(style: StorageLocalV2['regionHideStyle']) {
		await saveRegionHideStyle(style);
		refresh(this.regionHideStyle);

		sendToServiceWorker({
			type: 'notifyOptionsUpdated',
		})
	}

	async setSettingsLocked(locked: boolean) {
		await saveSettingsLocked(locked);
		await refresh(this.settingsLocked);
	}

	async setHideQuotes(hideQuotes: boolean) {
		await saveHideQuotes(hideQuotes);
		refresh(this.hideQuotes);
		sendToServiceWorker({
			type: 'notifyOptionsUpdated',
		})
	}

	async newQuoteList(): Promise<QuoteListId> {
		const id = await saveNewQuoteList({ title: 'New List', quotes: [], imported: false, disabledQuoteIds: [] });
		return id;
	}
}
