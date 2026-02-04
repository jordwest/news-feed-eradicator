import { createSignal, type Accessor, type ResourceReturn, type Setter } from "solid-js";
import { createStore, reconcile } from "solid-js/store";

export type SignalObj<T> = {
	set: Setter<T>,
	get: Accessor<T>,
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

export const resourceObjReconciled = <T>(fn: () => Promise<T[]>) => {
	const [getInternal, setInternal] = createStore <{ items: T[] | null }>({ items: null });

	const get = () => getInternal.items;

	const refetch = async () => {
		const newStore: { items: T[] } = { items: await fn() };
		setInternal(reconcile(newStore, { key: 'id', merge: true }));
	};

	refetch();

	return {get, refetch};
};
