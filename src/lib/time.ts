export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;

export const displayDuration = (duration: number): string => {
	if (duration < MINUTE) {
		return `${Math.floor(duration / SECOND)}s`;
	}

	if (duration < HOUR) {
		const minutes = Math.floor(duration / MINUTE);
		const seconds = Math.floor((duration - (minutes * MINUTE)) / SECOND);
		return `${minutes}m ${seconds}s`;
	}

	const hours = Math.floor(duration / HOUR);
	const minutes = Math.floor((duration - (hours * HOUR)) / MINUTE);
	const seconds = Math.floor((duration - (hours * HOUR) - (minutes * MINUTE)) / SECOND);
	return `${hours}h ${minutes}m ${seconds}s`;
}
