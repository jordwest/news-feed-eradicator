const PATHS = ['', '/'];

export default function isEnabled(paths: Array<String> = []) {
	return [...PATHS, ...paths].indexOf(window.location.pathname) > -1;
}
