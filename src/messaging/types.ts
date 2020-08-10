import { SettingsActionObject } from '../background/store/action-types';
import { SettingsState } from '../background/store/reducer';

export enum MessageType {
	OPTIONS_PAGE_OPEN,
	SETTINGS_ACTION,
	SETTINGS_CHANGED,
}

export type Message =
	| { t: MessageType.OPTIONS_PAGE_OPEN }
	| {
			t: MessageType.SETTINGS_ACTION;
			action: SettingsActionObject;
	  }
	| {
			t: MessageType.SETTINGS_CHANGED;
			settings: SettingsState;
	  };
