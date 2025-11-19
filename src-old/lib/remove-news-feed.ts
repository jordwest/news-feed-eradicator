export const removeNode = (node: Element) =>
	node.parentNode && node.parentNode.removeChild(node);

const removeChildren = (node: Element) => {
	while (node.firstChild) {
		node.removeChild(node.firstChild);
	}
};

type ElementList = {
	toRemove?: string[];
	toEmpty?: string[];
};

export const remove = (elements: ElementList) => {
	if (elements.toRemove)
		document.querySelectorAll(elements.toRemove.join(',')).forEach(removeNode);
	if (elements.toEmpty)
		document
			.querySelectorAll(elements.toEmpty.join(','))
			.forEach(removeChildren);
};
