import manifest from '../manifest';
import { watch } from "fs/promises";
import { build } from 'vite';
import { $ } from 'bun';
import solidPlugin from 'vite-plugin-solid';

const PROJECT_ROOT = `${__dirname}/../..`;

async function buildAll(): Promise<void> {
	console.log('Rebuilding')
	await buildSiteList();
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

function startServer() {
	const server = Bun.serve({
		port: 4080,
		routes: {
			'/sitelist.json': async () => {
				// This is run in a unique process each time so that it reimports sitelist.ts on change
				const output = await $`bun run ${__dirname}/build-sitelist.ts`.json();
				console.info(output);

				return new Response(JSON.stringify(output), {
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

async function buildSiteList(): Promise<void> {
	const output = await $`bun run ${__dirname}/build-sitelist.ts`.json();
	const siteListJson = JSON.stringify(output, null, 2);

	await Bun.write('./build/sitelist.json', siteListJson);
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
