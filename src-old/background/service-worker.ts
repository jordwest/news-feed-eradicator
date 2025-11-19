import { createBackgroundStore } from './store/store';
import { getBrowser, TabId } from '../webextension';
import { Sites } from '../sites';

createBackgroundStore();

const browser = getBrowser();
browser.action.onClicked.addListener(() => {
	browser.runtime.openOptionsPage();
});
