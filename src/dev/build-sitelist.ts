async function buildSiteList() {
	const thing = (await import(`${__dirname}/../sitelist/_index.ts`)).default;
	console.log(JSON.stringify(thing, null, 4));
}

buildSiteList();
