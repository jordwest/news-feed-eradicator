import { createResource } from "solid-js";
import { resourceObj } from "/lib/solid-util";
import { loadRegionHideStyle, loadWidgetStyle, saveRegionHideStyle, saveWidgetStyle } from "/storage/storage";
import type { StorageLocalV2 } from "/storage/schema";
import { sendToServiceWorker } from "/messaging/messages";

export class StorageState {
	widgetStyle = resourceObj(createResource(loadWidgetStyle));
	regionHideStyle = resourceObj(createResource(loadRegionHideStyle));

	async setWidgetStyle(style: StorageLocalV2['widgetStyle']) {
		await saveWidgetStyle(style)
		this.widgetStyle.refetch();

		sendToServiceWorker({
			type: 'notifyOptionsUpdated',
		})
	}

	async setRegionHideStyle(style: StorageLocalV2['regionHideStyle']) {
		await saveRegionHideStyle(style);
		this.regionHideStyle.refetch();

		sendToServiceWorker({
			type: 'notifyOptionsUpdated',
		})
	}
}
