import manifest from '../manifest';
import { watch } from "fs/promises";
import { build } from 'vite';
import { $ } from 'bun';
import solidPlugin from 'vite-plugin-solid';
import type { SiteList } from '/types/sitelist';

const PROJECT_ROOT = `${__dirname}/../..`;
const SITELIST_URL = 'https://jordwest.github.io/news-feed-eradicator-lists/sitelist.json';

async function buildAll(): Promise<void> {
	console.log('Rebuilding')
	await bundleSiteList();
	await buildServiceWorker();
	await buildOptionsPage();
	await buildIntercept();
	await buildManifest();

	copy('assets/icon16.png', 'build/assets/icon16.png');
	copy('assets/icon32.png', 'build/assets/icon32.png');
	copy('assets/icon48.png', 'build/assets/icon48.png');
	copy('assets/icon64.png', 'build/assets/icon64.png');
	copy('assets/icon128.png', 'build/assets/icon128.png');

	copy('assets/icons/logo-contrast-16.png', 'build/assets/icons/logo-contrast-16.png');
	copy('assets/icons/logo-contrast-32.png', 'build/assets/icons/logo-contrast-32.png');
	copy('assets/icons/logo-contrast-64.png', 'build/assets/icons/logo-contrast-64.png');
}

function startServer() {
	const server = Bun.serve({
		port: 4080,
		routes: {
			'/sitelist.json': async () => {
				const siteListJson = await fetchSiteList();
				console.info(siteListJson);

				return new Response(JSON.stringify(siteListJson), {
					headers: {
						'Content-Type': 'application/json'
					}
				});
			}
		}
	})
}

async function watchAll(): Promise<void> {

	await buildAll();

	startServer();

	const watcher = watch(`${PROJECT_ROOT}/src`, {recursive: true});

	console.info('Watching for changes');

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

if (Bun.argv.includes('-w') || Bun.argv.includes('--watch')) {
	watchAll();
} else {
	buildAll();
}

async function buildServiceWorker(): Promise<void> {
	await build({
		root: `${PROJECT_ROOT}/src`,
		build: {
			outDir: `${PROJECT_ROOT}/build`,
			rollupOptions: {
				input: '/entrypoints/service-worker/service-worker.ts',
				output: {
					assetFileNames: 'entrypoints/service-worker/[name].[ext]',
					entryFileNames: 'entrypoints/service-worker/[name].js'
				},
			},
			minify: false, // Never minify - for web store review
		}
	});
}

async function fetchSiteList(): Promise<SiteList> {
	const siteListResponse = await fetch(SITELIST_URL);
	return await siteListResponse.json();
}

async function bundleSiteList(): Promise<void> {
	const siteListJson = await fetchSiteList();
	console.log('Bundling sitelist with commit hash: ', siteListJson.commit, ', timestamp: ', siteListJson.buildTimestamp);
	await Bun.write('./build/sitelist.json', JSON.stringify(siteListJson, null, 2));

}

async function buildIntercept(): Promise<void> {
	await build({
		root: `${PROJECT_ROOT}/src`,
		plugins: [solidPlugin()],
		build: {
			outDir: `${PROJECT_ROOT}/build`,
			rollupOptions: {
				input: '/entrypoints/intercept/intercept.tsx',
				output: {
					assetFileNames: 'entrypoints/intercept/[name].[ext]',
					entryFileNames: 'entrypoints/intercept/[name].js'
				},
			},
			minify: false,
		}
	});
}

async function buildManifest(): Promise<void> {
	Bun.write('./build/manifest.json', JSON.stringify(manifest, null, 2));
}

async function buildOptionsPage(): Promise<void> {
	await build({
		root: `${PROJECT_ROOT}/src`,
		plugins: [solidPlugin()],
		build: {
			outDir: `${PROJECT_ROOT}/build`,
			rollupOptions: {
				input: '/entrypoints/options-page/index.html',
				output: {
					assetFileNames: 'entrypoints/options-page/[name].[ext]',
					entryFileNames: 'entrypoints/options-page/[name].js'
				},
			},
			minify: false,
		}
	});
}

function copy(from: string, to: string) {
	const file = Bun.file(`${PROJECT_ROOT}/${from}`);
	Bun.write(`${PROJECT_ROOT}/${to}`, file);
}
