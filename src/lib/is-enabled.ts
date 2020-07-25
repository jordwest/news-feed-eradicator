const PATHS = ['/feed', '/feed/'];

export default function isEnabled() {
	return [...PATHS].indexOf(window.location.pathname) > -1;
}
