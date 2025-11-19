import { VNode } from 'snabbdom/vnode';
import { h } from 'snabbdom';

export const WarningAlert = (content: VNode | string) =>
	h('div.pad-2.col-bg-warn.shadow', content);
export const ErrorAlert = (content: VNode | string) =>
	h('div.pad-2.col-bg-err.shadow', content);
