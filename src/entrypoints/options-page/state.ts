import { createSignal, createEffect, type Accessor, type Setter, type Signal, createContext, useContext, createResource, type ResourceReturn } from "solid-js";
import type { QuoteList, QuoteListId } from "../../storage/schema";
import { assertDefined } from "../../lib/util";
import type { SiteId } from "../../types/sitelist";
import { loadQuoteList, loadQuoteLists } from "../../storage/storage";
import type { Quote } from "../../quote";

type SignalObj<T> = {
	set: Setter<T>,
	get: Accessor<T>,
};

export type EditingState = {
	type: 'existingQuote'
	existingQuoteId: string
} | {
	type: 'newQuote'
} | {
	type: 'quoteListTitle',
	editValue: SignalObj<string>,
	quoteListId: QuoteListId,
};

export type UndoState = {
	type: 'deleteQuote',
	quoteListId: QuoteListId,
	quote: Quote,
} | {
	type: 'deleteQuoteList',
	quoteList: QuoteList,
};

/**
 * Destructuring is inconvenient inside objects, so this is to make it more explicit what's going on
 */
export const signalObj = <T>(defaultVal: T): SignalObj<T> => {
	const [get, set] = createSignal(defaultVal);
	return {set, get}
};

export const resourceObj = <T, R>(v: ResourceReturn<T, R>) => {
	const [get, { refetch }] = v;
	return {get, refetch};
};

export type PageId = 'sites' | 'quotes' | 'about';

export class OptionsPageState {
	selectedSiteId = signalObj<SiteId | null>(null);
	selectedQuoteListId = signalObj<QuoteListId | null>(null);
	editing = signalObj<EditingState | null>(null);
	page = signalObj<PageId>('sites');
	undo = signalObj<UndoState | null>(null);

	quoteLists = resourceObj(createResource(loadQuoteLists));
	selectedQuoteList = resourceObj(createResource(this.selectedQuoteListId.get, async (qlId) => {
		if (qlId == null) return null;
		return await loadQuoteList(qlId!);
	}));

	withEditingType<T extends NonNullable<EditingState>['type']>(type: T) {
		const editingState = this.editing.get();
		if (editingState == null) return null;
		if (editingState.type !== type) return null;
		return editingState as Extract<NonNullable<EditingState>, { type: T }>;
	}
}

export const OptionsPageStateContext = createContext<OptionsPageState>();
export const useOptionsPageState = () => assertDefined(useContext(OptionsPageStateContext));
