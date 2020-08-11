import { CustomQuote } from '../../quote';
import { getBrowser } from '../../webextension';
import { SiteId, Sites } from '../../sites';

export namespace Settings {
	type V1 = {
		version: 1;
		showQuotes: boolean;
		builtinQuotesEnabled: boolean;
		featureIncrement: number;
		hiddenBuiltinQuotes: number[];
		customQuotes: CustomQuote[];
		sites: Partial<SitesState>;
	};

	export type SitesState = Record<SiteId, SiteState>;

	const defaults: V1 = {
		version: 1,
		showQuotes: true,
		builtinQuotesEnabled: true,
		featureIncrement: 0,
		hiddenBuiltinQuotes: [],
		customQuotes: [],
		sites: {},
	};
	export const defaultSites = (): SitesState => {
		const sites: SitesState = {} as SitesState;
		for (const siteId of Object.keys(Sites)) {
			sites[siteId] = { type: SiteStateTag.CHECK_PERMISSIONS };
		}
		return sites;
	};

	export enum SiteStateTag {
		ENABLED = 'enabled',
		CHECK_PERMISSIONS = 'check_permissions',
		DISABLED = 'disabled',
		DISABLED_TEMPORARILY = 'disabled_temporarily',
	}

	export type SiteState =
		| { type: SiteStateTag.ENABLED }
		| { type: SiteStateTag.DISABLED }
		| { type: SiteStateTag.CHECK_PERMISSIONS }
		| { type: SiteStateTag.DISABLED_TEMPORARILY; disabled_until: number };

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
