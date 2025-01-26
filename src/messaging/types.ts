import { UnknownAction } from '@reduxjs/toolkit';
import { SettingsState } from '../background/store/state-types';

export enum MessageType {
	OPTIONS_PAGE_OPEN,
	SETTINGS_ACTION,
	SETTINGS_CHANGED,
}

export type Message =
	| { t: MessageType.OPTIONS_PAGE_OPEN }
	| {
			t: MessageType.SETTINGS_ACTION;
			action: UnknownAction;
	  }
	| {
			t: MessageType.SETTINGS_CHANGED;
			settings: SettingsState;
	  };
