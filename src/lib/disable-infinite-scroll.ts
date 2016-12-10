/**
 * Intercept the scroll event and kill it to prevent the
 * infinite scroll algorithm triggering.
 */

import isEnabled from './is-enabled';

// Check if the event target is a chat conversation
let isConversation = ( target ) => {
	if ( ! target || ! target.matches ) {
		return false;
	}

	if ( target.matches( '.conversation' ) || target.matches( '#ChatTabsPagelet' ) ) {
		return true;
	}

	if ( ! target.parentNode ) {
		return false;
	}

	return isConversation( target.parentElement );
}
	
const maybeBlock = ( event: MouseWheelEvent ) => {
	if ( ! isEnabled() ) {
		return false;
	}

	// Allow infinite scrolling of chats on the home page
	if ( isConversation( event.target ) ) {
		return false;
	}

	event.stopImmediatePropagation();
	return true;
}

export default function() {
	window.addEventListener('scroll', maybeBlock, true);
	window.addEventListener('mousewheel', maybeBlock, true);
}
