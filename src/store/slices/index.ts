import currentQuoteReducer, { setCurrentQuote, CurrentQuote, quoteSaveClicked, quoteRemoveCurrent } from './currentQuote';
import editingSourceReducer, {startEditSource, cancelEditSource, setQuoteSource} from './editingSource';
import editingTextReducer, {startEditText, cancelEditText, setQuoteText} from './editingText';
import errorReducer, {cancelEditError, parseError} from './error';
import isEditingBulkReducer, {toggleBulkEdit} from './isEditingBulk';
import isEditingQuoteReducer, {startEditQuote, cancelEditQuote} from './isEditingQuote';
import isQuoteMenuVisibleReducer, {showMenu, hideMenu, toggleMenu} from './isQuoteMenuVisible';
import optionsReducer, {uiSitesSiteDisableConfirmShow, uiSitesSiteDisableConfirmed, uiOptionsShow, uiOptionsTabShow, uiOptionsQuoteTabShow, uiOptionsBackgroundSettingsChanged, OptionsState, uiSitesSiteClick} from './options';
import settingsReducer, {backgroundSettingsChanged} from './settings';
import { backgroundAction } from './backgroundAction';
import { addQuotesBulk, selectNewQuote } from './newQuoteSlice';

export {
    // reducers
    currentQuoteReducer,
    editingSourceReducer,
    editingTextReducer,
    errorReducer,
    isEditingBulkReducer,
    isEditingQuoteReducer,
    isQuoteMenuVisibleReducer,
    optionsReducer,
    settingsReducer,
    
    // actions
    backgroundAction,
    setCurrentQuote,
    startEditSource,
    cancelEditSource,
    setQuoteSource,
    startEditText,
    cancelEditText,
    setQuoteText,
    cancelEditError,
    parseError,
    toggleBulkEdit,
    startEditQuote,
    cancelEditQuote,
    showMenu,
    hideMenu,
    toggleMenu,
    uiSitesSiteDisableConfirmShow,
    uiSitesSiteDisableConfirmed,
    uiOptionsShow,
    uiOptionsTabShow,
    uiOptionsQuoteTabShow,
    uiOptionsBackgroundSettingsChanged,
    uiSitesSiteClick,
    backgroundSettingsChanged,
    quoteSaveClicked,
    quoteRemoveCurrent,
    selectNewQuote,
    addQuotesBulk,

    // types
    OptionsState,
    CurrentQuote,
};
