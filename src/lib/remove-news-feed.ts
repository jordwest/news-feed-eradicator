// Elements in here are removed from the DOM.
// These selectors should also be added to `eradicate.css`
// to ensure they're hidden before the script loads.
const elementsToRemove =
	'.ticker_stream,' +
	'.ego_column,' +
	'#pagelet_gaming_destination_rhc,' +
	'#stories_pagelet_rhc,' +
	'#fb_stories_card_root,' +
	'#stories_pagelet_below_composer,' +
	'#pagelet_trending_tags_and_topics,' +
	'#pagelet_canvas_nav_content';

const elementsToEmpty = '[id^=topnews_main_stream]';

const removeNode = node => node.parentNode.removeChild(node);

const removeChildren = node => {
	while (node.firstChild) {
		node.removeChild(node.firstChild);
	}
};

export default function() {
	document.querySelectorAll(elementsToRemove).forEach(removeNode);
	document.querySelectorAll(elementsToEmpty).forEach(removeChildren);
}
