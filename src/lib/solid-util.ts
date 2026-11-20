import { createSignal, type Accessor, type Setter } from "solid-js";
import { createStore, reconcile } from "solid-js";

export type SignalObj<T> = {
	set: Setter<T>,
	get: Accessor<T>,
};

/**
 * Destructuring is inconvenient inside objects, so this is to make it more explicit what's going on
 */
export const signalObj = <T>(defaultVal: Exclude<T, Function>): SignalObj<T> => {
	const [get, set] = createSignal(defaultVal);
	return {set, get}
};

export const resourceObjReconciled = <T>(fn: () => Promise<T[]>) => {
	const [getInternal, setInternal] = createStore <{ items: T[] | null }>({ items: null });

	const get = () => getInternal.items;

	const refetch = async () => {
		const newStore: { items: T[] } = { items: await fn() };
		setInternal(reconcile(newStore, 'id'));
	};

	refetch();

	return {get, refetch};
};
