export const removeNode = (node: Element) => node.parentNode.removeChild(node);

const removeChildren = (node: Element) => {
	while (node.firstChild) {
		node.removeChild(node.firstChild);
	}
};

type ElementList = {
	toRemove: string[];
	toEmpty: string[];
};

export const remove = (elements: ElementList) => {
	document.querySelectorAll(elements.toRemove.join(',')).forEach(removeNode);
	document.querySelectorAll(elements.toEmpty.join(',')).forEach(removeChildren);
};
