import builtinQuotesEnabledReducer, {toggleBuiltinQuotesEnabled} from "./builtinQuotesEnabled";
import { contentScriptsRegister } from "./contentScripts";
import customQuotesReducer, {addCustomQuote, removeCustomQuote} from "./customQuotes";
import featureIncrementReducer, {incrementFeature} from "./featureIncrement";
import hiddenBuiltinQuotesReducer, {showHiddenBuiltinQuote, hideHiddenBuiltinQuote, resetHiddenBuiltinQuotes} from "./hiddenBuiltinQuotes";
import permissionsReducer, {checkPermissions, updatePermissions} from "./permissions";
import settingsReducer, {settingsLoaded, settingsLoad} from "./settings";
import showQuotesReducer, {toggleShowQuotes} from "./showQuotes";
import sitesReducer, {setSiteState} from "./sites";

// Create a utility type for extracting action types
type ActionType<T> = T extends { type: infer U } ? U : never;

export type BackgroundActionObject =
    | ActionType<ReturnType<typeof contentScriptsRegister>>
    | ActionType<ReturnType<typeof toggleBuiltinQuotesEnabled>>
    | ActionType<ReturnType<typeof addCustomQuote>>
    | ActionType<ReturnType<typeof removeCustomQuote>>
    | ActionType<ReturnType<typeof incrementFeature>>
    | ActionType<ReturnType<typeof showHiddenBuiltinQuote>>
    | ActionType<ReturnType<typeof hideHiddenBuiltinQuote>>
    | ActionType<ReturnType<typeof resetHiddenBuiltinQuotes>>
    | ActionType<ReturnType<typeof checkPermissions>>
    | ActionType<ReturnType<typeof updatePermissions>>
    | ActionType<ReturnType<typeof settingsLoaded>>
    | ActionType<ReturnType<typeof toggleShowQuotes>>
    | ActionType<ReturnType<typeof setSiteState>>
    | ActionType<ReturnType<typeof settingsLoad>>;

export {
    // reducers
    builtinQuotesEnabledReducer,
    customQuotesReducer,
    featureIncrementReducer,
    hiddenBuiltinQuotesReducer,
    permissionsReducer,
    settingsReducer,
    showQuotesReducer,
    sitesReducer,

    // actions
    contentScriptsRegister,
    toggleBuiltinQuotesEnabled,
    addCustomQuote,
    removeCustomQuote,
    incrementFeature,
    showHiddenBuiltinQuote,
    hideHiddenBuiltinQuote,
    resetHiddenBuiltinQuotes,
    checkPermissions,
    updatePermissions,
    settingsLoaded,
    toggleShowQuotes,
    setSiteState,
    settingsLoad,
};