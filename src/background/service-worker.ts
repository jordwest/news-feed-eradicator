import { createBackgroundStore } from './store/store';
import { getBrowser } from '../webextension';
import { BackgroundActionType } from './store/action-types';

const store = createBackgroundStore();

const browser = getBrowser();
browser.action.onClicked.addListener(() => {
	browser.runtime.openOptionsPage();
});

browser.runtime.onStartup.addListener(() => {
	store.dispatch({ type: BackgroundActionType.STARTUP });
})