import { createSignal, createEffect, type Accessor, type Setter, type Signal, createContext, useContext } from "solid-js";
import type { QuoteListId } from "../../storage/schema";
import { assertDefined } from "../../lib/util";
import type { SiteId } from "../../types/sitelist";

type SignalObj<T> = {
	set: Setter<T>,
	get: Accessor<T>,
};

type EditingState = {
	type: 'existingQuote'
	existingQuoteId: string
} | {
	type: 'newQuote'
};

/**
 * Destructuring is inconvenient inside objects, so this is to make it more explicit what's going on
 */
const signalObj = <T>(defaultVal: T): SignalObj<T> => {
	const [get, set] = createSignal(defaultVal);
	return {set, get}
};

export type PageId = 'sites' | 'quotes' | 'about';

export class OptionsPageState {
	selectedSiteId = signalObj<SiteId | null>(null);
	selectedQuoteListId = signalObj<QuoteListId | null>(null);
	editing = signalObj<EditingState | null>(null);
	page = signalObj<PageId>('sites');
}

export const OptionsPageStateContext = createContext<OptionsPageState>();
export const useOptionsPageState = () => assertDefined(useContext(OptionsPageStateContext));
