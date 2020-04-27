import isEnabled from './is-enabled';

// Unforunately the browser provides no native way to observe route changes initiated
// by the page. The `popstate` event only observes browser initiated back/forward events.
// So, we resort to this hack: checking the document URL every n milliseconds, to see if
// it's changed.
// NB: I also tried monkey patching history.pushState to intercept the calls, but that
// had no effect.
const CHECK_INTERVAL = 1000;

let lastPath = undefined;
let element = document.querySelector('html');
export function setupRouteChange() {
	const onChange = (): any => {
		if (isEnabled()) {
			element.dataset.nfeEnabled = 'true';
		} else {
			// Delay showing the feed when switching pages, sometimes it can appear
			// before the page has switched
			setTimeout(() => {
				element.dataset.nfeEnabled = 'false';
			}, 1000);
		}
	};

	let timer = undefined;
	const checkIfLocationChanged = () => {
		let path = document.location.pathname;
		if (path != lastPath) {
			lastPath = path;
			onChange();
		}
		if (timer != null) {
			clearTimeout(timer);
		}
		timer = setTimeout(checkIfLocationChanged, CHECK_INTERVAL);
	};
	window.addEventListener('popstate', checkIfLocationChanged);

	checkIfLocationChanged();
}
