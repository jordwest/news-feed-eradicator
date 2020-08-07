const paths = {
	'facebook.com': ['', '/'],
	'twitter.com': ['/home', '/compose/tweet'],
};

export default function isEnabled() {
	for (let domain of Object.keys(paths)) {
		if (window.location.host.includes(domain)) {
			return paths[domain].indexOf(window.location.pathname) > -1;
		}
	}
}
