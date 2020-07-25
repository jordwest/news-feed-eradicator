export default function isEnabled() {
	return ['/feed', '/feed/'].some(t => t === window.location.pathname);
}
