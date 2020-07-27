import { SettingsActionObject } from '../settings/action-types';
import { SettingsState } from '../settings/reducer';

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
