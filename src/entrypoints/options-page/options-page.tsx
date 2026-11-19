import { render } from "@solidjs/web";
import h from "@solidjs/h";
import { Loading, Reveal, Show, type ParentComponent } from "solid-js";

import { OptionsPageState, OptionsPageStateContext, useOptionsPageState, type PageId } from "./state";
import { Snooze } from "./snooze";
import { SitesTabContent } from "./tabs/sites";
import { Undo } from "./undo";
import { QuotesTabContent } from "./tabs/quotes";
import { AboutTabContent } from "./tabs/about";
import { SnoozeTabContent } from "./tabs/snooze";
import { DebugTabContent } from "./tabs/debug";
import { StyleTabContent } from "./tabs/style";
import { versionText } from "/lib/util";
import { Skeleton } from "/shared/components/skeleton";

const PageTab: ParentComponent<{to: PageId}> = ({ to, children }) => {
	const state = useOptionsPageState();

	const isActive = () => state.page.get() === to;
	const classname = () => {
		const active = state.page.get() === to ? '' : 'bg-darken-100 hover:bg-darken-50'
		return `block py-2 px-4 ${active}`
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

			<Loading fallback={"Loading..."}>
				<OptionsPageStateContext value={state}>
					<Loading fallback={<Skeleton width="300px" height="85px" />}>
						<Snooze />
					</Loading>

					<Undo />

					<Loading>
						<Show when={!state.allSitePermissionsValid()}>
							<div class="flex p-4 card shadow primary outlined gap-2 cross-center">
								<div>⚠️</div>
								<p class="flex-1 flex cross-center">Some enabled sites need more permissions to work correctly.</p>
								<button class="primary" onClick={() => state.fixPermissions()}>Fix permissions</button>
							</div>
						</Show>
					</Loading>

					<Loading fallback={"Loading..."}>
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
					</Loading>

					<footer class="text-center space-y-4">
						<div>
							By <a href="https://west.io/">Jordan West</a> and <a href="https://github.com/jordwest/news-feed-eradicator/graphs/contributors">contributors</a>
						</div>
						<Loading>
							<div class="text-secondary font-xs">{versionText(state.siteList())}</div>
						</Loading>
					</footer>
				</OptionsPageStateContext>
			</Loading>
		</div>
	</div>
}

render(h(OptionsPage), document.querySelector("#root")!);
