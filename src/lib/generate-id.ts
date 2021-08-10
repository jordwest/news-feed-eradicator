export function generateID(): string {
	let key = '';
	while (key.length < 16) {
		key += Math.random().toString(16).substr(2);
	}
	return key.substr(0, 16);
}
