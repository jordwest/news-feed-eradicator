/**
 * Intercept the scroll event and kill it to prevent the
 * infinite scroll algorithm triggering.
 */

const paths = [ '', '/' ];

const maybeBlock = ( event ) => {
	if ( paths.indexOf( window.location.pathname ) ) {
		event.stopImmediatePropagation();
		return false;
	}
}

export default function() {
	window.addEventListener('scroll', maybeBlock, true);
	window.addEventListener('mousewheel', maybeBlock, true);
}
