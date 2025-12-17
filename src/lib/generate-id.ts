export function generateId(): string {
	let key = '';
	while (key.length < 16) {
		key += Math.random().toString(16).substring(2);
	}
	return key.substring(0, 16);
}
