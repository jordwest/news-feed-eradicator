import manifest from '../manifest';
import { watch } from "fs/promises";

const PROJECT_ROOT = `${__dirname}/../..`;

async function buildAll(): Promise<void> {
	await buildServiceWorker();
	await buildOptionsPage();
	await buildIntercept();
	await buildManifest();

	copy('assets/icon16.png', 'build/assets/icon16.png');
	copy('assets/icon32.png', 'build/assets/icon32.png');
	copy('assets/icon48.png', 'build/assets/icon48.png');
	copy('assets/icon64.png', 'build/assets/icon64.png');
	copy('assets/icon128.png', 'build/assets/icon128.png');
}

async function watchAll(): Promise<void> {
	await buildAll();

	const watcher = watch(`${PROJECT_ROOT}/src`, {recursive: true});

	for await (const event of watcher) {
		console.log(`BUILD: Detected ${event.eventType} in ${event.filename}`);

		// Who watches the watcher?
		if (event.filename != null && __filename.endsWith(event.filename)) {
			console.log('Exiting')
			return;
		}

		try {
			await buildAll()
		} catch (error) {
			console.error("Build error", error)
		}
	}
}

// buildAll();
watchAll();

async function buildServiceWorker(): Promise<void> {
	await Bun.build({
		root: PROJECT_ROOT,
	  entrypoints: [`./src/entrypoints/service-worker/service-worker.ts`],
	  outdir: `./build/service-worker`,
			naming: '[name].[ext]',
	  minify: false, // Never minify - for web store review
	});
}

async function buildIntercept(): Promise<void> {
	await Bun.build({
		root: PROJECT_ROOT,
	  entrypoints: [`./src/entrypoints/intercept/intercept.ts`],
	  outdir: `./build/intercept`,
			naming: '[name].[ext]',
	  minify: false, // Never minify - for web store review
	});
}

async function buildManifest(): Promise<void> {
	Bun.write('./build/manifest.json', JSON.stringify(manifest, null, 2));
}

async function buildOptionsPage(): Promise<void> {
	await Bun.build({
		root: PROJECT_ROOT,
	  entrypoints: [`./src/entrypoints/options-page/index.html`],
	  outdir: `./build/options-page`,
		naming: '[name].[ext]',
	  minify: false, // Never minify - for web store review
	});
}

function copy(from: string, to: string) {
	const file = Bun.file(`${PROJECT_ROOT}/${from}`);
	Bun.write(`${PROJECT_ROOT}/${to}`, file);
}
