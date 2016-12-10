/**
 * Intercept the scroll event and kill it to prevent the
 * infinite scroll algorithm triggering.
 */

import isEnabled from './is-enabled';

const maybeBlock = ( event ) => {
	if ( isEnabled() ) {
		event.stopImmediatePropagation();
		return false;
	}
}

export default function() {
	window.addEventListener('scroll', maybeBlock, true);
	window.addEventListener('mousewheel', maybeBlock, true);
}
