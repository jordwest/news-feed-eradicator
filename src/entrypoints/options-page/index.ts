import { getBrowser } from "../../lib/webextension";
console.log("Hi!");

document.querySelector("#test")!.addEventListener("click", async () => {
	const browser = getBrowser();
	const domain = document.querySelector("#domain")!.value;
	const origins = [`http://${domain}/*`, `https://${domain}/*`];
	const result = await browser.permissions.request({ origins, permissions: [] });

	// const port = browser.runtime.connect();
	browser.scripting.registerContentScripts([{
		id: origins.join(''),
		js: ['intercept/intercept.js'],
		runAt: "document_start",
		matches: origins,
		allFrames: false,
		// world: "MAIN"
	}]);

	console.log(result);
});
