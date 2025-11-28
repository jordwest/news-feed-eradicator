import packageJson from '../package.json';

export default {
	"name": "News Feed Eradicator",
	"version": packageJson.version,
	"description": packageJson.description,
	"manifest_version": 3,
	"permissions": ["storage", "scripting"],
	"optional_host_permissions": ["*://*/*"],
	"action": {
		"default_icon": {
			"16": "assets/icon16.png",
			"32": "assets/icon32.png",
			"48": "assets/icon48.png",
			"64": "assets/icon64.png",
			"128": "assets/icon128.png"
		},
		"default_title": "News Feed Eradicator"
	},
	"background": {
		"service_worker": "service-worker/service-worker.js",
		"scripts": ["service-worker/service-worker.js"],
		"type": "module"
	},
	"options_ui": {
		"page": "options-page/index.html",
		"open_in_tab": true,
		"browser_style": false
	},
	"icons": {
		"16": "assets/icon16.png",
		"32": "assets/icon32.png",
		"48": "assets/icon48.png",
		"64": "assets/icon64.png",
		"128": "assets/icon128.png"
	},
	"web_accessible_resources": [
		{
			"resources": ["sitelist.json", "intercept/intercept.js"],
			"extension_ids": [],
		}
	]
}
