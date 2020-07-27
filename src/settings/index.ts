import { CustomQuote } from '../quote';
import { getBrowser } from '../webextension';

export namespace Settings {
	type V1 = {
		version: 1;
		showQuotes: boolean;
		builtinQuotesEnabled: boolean;
		featureIncrement: number;
		hiddenBuiltinQuotes: number[];
		customQuotes: CustomQuote[];
	};

	const defaults: V1 = {
		version: 1,
		showQuotes: true,
		builtinQuotesEnabled: true,
		featureIncrement: 0,
		hiddenBuiltinQuotes: [],
		customQuotes: [],
	};

	export type T = V1;

	export async function load(): Promise<T> {
		return getBrowser()
			.storage.sync.get(null)
			.then((settings: Partial<V1>) => ({
				...defaults,
				...settings,
			}));
	}

	export async function save(settings: T) {
		return getBrowser().storage.sync.set({ ...defaults, ...settings });
	}
}
