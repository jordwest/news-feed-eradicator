export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;

export const readableDuration = (milliseconds: number) => {
	if (milliseconds < MINUTE) {
		return 'less than a minute';
	}
	if (milliseconds < HOUR) {
		return Math.round(milliseconds / MINUTE) + ' minutes';
	}
	if (milliseconds < DAY) {
		return Math.round(milliseconds / HOUR) + ' hours';
	}
	return Math.round(milliseconds / DAY) + ' days';
};
