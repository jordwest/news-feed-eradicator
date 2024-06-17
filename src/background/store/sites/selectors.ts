import { SettingsState } from '../reducer';
import { SiteId, Sites, Site } from '../../../sites';
import { Settings } from '..';

type SettingsHealth = {
    noSitesEnabled: boolean;
    sitesNeedingPermissions: number;
};

export enum SiteStatusTag {
    ENABLED,
    NEEDS_NEW_PERMISSIONS,
    DISABLED,
    DISABLED_TEMPORARILY,
    ENABLED_TEMPORARILY, // Existing state
    ENABLED_FOR_15_MINUTES, // New state for enabling temporarily for 15 minutes
    AUTO_DISABLED_TEMPORARILY, // New state for auto-disabled temporarily
}

export type SiteStatus =
    | { type: SiteStatusTag.ENABLED }
    | { type: SiteStatusTag.NEEDS_NEW_PERMISSIONS }
    | { type: SiteStatusTag.DISABLED }
    | { type: SiteStatusTag.DISABLED_TEMPORARILY; until: number }
    | { type: SiteStatusTag.ENABLED_TEMPORARILY; until: number }
    | { type: SiteStatusTag.AUTO_DISABLED_TEMPORARILY; until: number }
    | { type: SiteStatusTag.ENABLED_FOR_15_MINUTES }; // Add new type without properties




export function getSettingsHealth(state: SettingsState): SettingsHealth {
    let atLeastOneSiteEnabled = false;
    let sitesNeedingPermissions = 0;
    const siteStatus = getSiteStatus(state);

    Object.keys(siteStatus).forEach((id) => {
        const s: SiteStatus = siteStatus[id];
        if (
            s.type === SiteStatusTag.NEEDS_NEW_PERMISSIONS ||
            s.type === SiteStatusTag.DISABLED_TEMPORARILY ||
            s.type === SiteStatusTag.ENABLED ||
            s.type === SiteStatusTag.ENABLED_TEMPORARILY ||
            s.type === SiteStatusTag.AUTO_DISABLED_TEMPORARILY
        ) {
            atLeastOneSiteEnabled = true;
        }
        if (s.type === SiteStatusTag.NEEDS_NEW_PERMISSIONS) {
            sitesNeedingPermissions += 1;
        }
    });

    return {
        noSitesEnabled: !atLeastOneSiteEnabled,
        sitesNeedingPermissions,
    };
}

namespace Record {
    type ValidKey = string;

    export function map<Key extends ValidKey, ValFrom, ValTo>(
        record: Record<Key, ValFrom>,
        mapper: (key: string, val: ValFrom) => ValTo
    ): Record<Key, ValTo> {
        const out: Record<Key, ValTo> = {} as Record<Key, ValTo>;
        for (const key of Object.keys(record)) {
            out[key] = mapper(key, record[key]);
        }
        return out;
    }
}

/*
 * Combines the explicit user settings with the granted permissions to work
 * out whether anything needs updating
 */
export function getSiteStatus(state: SettingsState): Record<SiteId, SiteStatus> {
    return Record.map(state.sites, (key, siteState) => {
        if (!siteState) {
            return { type: SiteStatusTag.DISABLED };
        }

        const site: Site = Sites[key];
        const { origins } = state.permissions;
        const grantedOrigins = site.origins.filter(origin => origins.includes(origin));

        switch (siteState.type) {
            case Settings.SiteStateTag.ENABLED:
                if (grantedOrigins.length === site.origins.length) {
                    return { type: SiteStatusTag.ENABLED };
                }
                return { type: SiteStatusTag.NEEDS_NEW_PERMISSIONS };

            case Settings.SiteStateTag.CHECK_PERMISSIONS:
                if (grantedOrigins.length === site.origins.length) {
                    return { type: SiteStatusTag.ENABLED };
                } else if (grantedOrigins.length > 0) {
                    return { type: SiteStatusTag.NEEDS_NEW_PERMISSIONS };
                }
                return { type: SiteStatusTag.DISABLED };

            case Settings.SiteStateTag.DISABLED_TEMPORARILY:
                if (grantedOrigins.length === site.origins.length) {
                    if (siteState.disabled_until && siteState.disabled_until > Date.now()) {
                        return {
                            type: SiteStatusTag.DISABLED_TEMPORARILY,
                            until: siteState.disabled_until,
                        };
                    } else {
                        return { type: SiteStatusTag.ENABLED };
                    }
                }
                return { type: SiteStatusTag.NEEDS_NEW_PERMISSIONS };
//@ts-ignore
            case Settings.SiteStateTag.ENABLED_TEMPORARILY:
                if (grantedOrigins.length === site.origins.length) {
					//@ts-ignore
                    if (siteState.enabled_until && siteState.enabled_until > Date.now()) {
                        return {
                            type: SiteStatusTag.ENABLED_TEMPORARILY,
							//@ts-ignore
                            until: siteState.enabled_until,
                        };
                    } else {
                        return { type: SiteStatusTag.DISABLED };
                    }
                }
                return { type: SiteStatusTag.NEEDS_NEW_PERMISSIONS };

            default:
                return { type: SiteStatusTag.DISABLED }; // Default case if type is not recognized
        }
    });
}