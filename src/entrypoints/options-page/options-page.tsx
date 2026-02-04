import { render } from "solid-js/web";
import h from "solid-js/h";
import { Show, type ParentComponent } from "solid-js";

import { OptionsPageState, OptionsPageStateContext, useOptionsPageState, type PageId } from "./state";
import { Snooze } from "./snooze";
import { SitesTabContent } from "./tabs/sites";
import { Undo } from "./undo";
import { QuotesTabContent } from "./tabs/quotes";
import { AboutTabContent } from "./tabs/about";
import { SnoozeTabContent } from "./tabs/snooze";
import { DebugTabContent } from "./tabs/debug";
import { StyleTabContent } from "./tabs/style";

const PageTab: ParentComponent<{to: PageId}> = ({ to, children }) => {
	const state = useOptionsPageState();

	const isActive = () => state.page.get() === to;
	const classname = () => {
		const active = state.page.get() === to ? '' : 'bg-darken-100 hover:bg-darken-50'
		return `block font-xl py-2 px-4 ${active}`
	};

	return <li role="tab" aria-selected={isActive() ? 'true' : 'false'}><button class={classname()} onClick={() => state.page.set(to)}>{children}</button></li>;
}

const PageTabs = () => {
	const state = useOptionsPageState();

	return <ul role="tablist" class="">
		<PageTab to="sites">Sites</PageTab>
		<PageTab to="snooze">Snooze</PageTab>
		<PageTab to="quotes">Quotes</PageTab>
		<PageTab to="style">Style</PageTab>
		<PageTab to="about">About</PageTab>
		<Show when={state.page.get() === 'debug'}>
			<PageTab to="debug">Debug</PageTab>
		</Show>
	</ul>;
}

const OptionsPage = () => {
	const state = new OptionsPageState();

	return <div class="flex axis-center text-figure">
		<div class="w-full mw-lg space-y-8 py-4">
			<h1 class="text-center font-3xl text-secondary">News Feed Eradicator</h1>

			<OptionsPageStateContext.Provider value={state}>
				<Snooze />

				<Undo />

				<Show when={!state.allSitePermissionsValid()}>
					<div class="flex p-4 card shadow primary outlined gap-2 cross-center">
						<div>⚠️</div>
						<p class="flex-1 flex cross-center">Some enabled sites need more permissions to work correctly.</p>
						<button class="primary" onClick={() => state.fixPermissions()}>Fix permissions</button>
					</div>
				</Show>

				<nfe-tabs>
					<PageTabs />
					<div role="tabpanel" class="shadow">
						<Show when={state.page.get() === 'sites'}>
							<SitesTabContent />
						</Show>

						<Show when={state.page.get() === 'snooze'}>
							<SnoozeTabContent />
						</Show>

						<Show when={state.page.get() === 'quotes'}>
							<QuotesTabContent />
						</Show>

						<Show when={state.page.get() === 'style'}>
							<StyleTabContent />
						</Show>

						<Show when={state.page.get() === 'about'}>
							<AboutTabContent />
						</Show>

						<Show when={state.page.get() === 'debug'}>
							<DebugTabContent />
						</Show>
					</div>
				</nfe-tabs>

				<footer class="text-center">
					By <a href="https://west.io/">Jordan West</a> and <a href="https://github.com/jordwest/news-feed-eradicator/graphs/contributors">contributors</a>
				</footer>
			</OptionsPageStateContext.Provider>
		</div>
	</div>
}

render(h(OptionsPage), document.querySelector("#root")!);
