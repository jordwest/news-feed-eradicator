import { getBrowser } from '../webextension';
import { Message, MessageType } from '../messaging/types';

const browser = getBrowser();
browser.runtime.onMessage.addListener((msg: Message) => {
	switch (msg.t) {
		case MessageType.OPTIONS_PAGE_OPEN:
			return browser.runtime.openOptionsPage();
	}
});
