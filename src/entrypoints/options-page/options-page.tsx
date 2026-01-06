import { render } from "solid-js/web";
import h from "solid-js/h";
import { Show, type ParentComponent } from "solid-js";

import { OptionsPageState, OptionsPageStateContext, useOptionsPageState, type PageId } from "./state";
import { Snooze } from "./snooze";
import { SiteList } from "./tabs/sites";
import { Undo } from "./undo";
import { QuotesTabPanel } from "./tabs/quotes";

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
	return <ul role="tablist" class="">
		<PageTab to="sites">Sites</PageTab>
		<PageTab to="quotes">Quotes</PageTab>
		<PageTab to="about">About</PageTab>
	</ul>;
}

const OptionsPage = () => {
	const state = new OptionsPageState();

	return <div class="flex axis-center text-figure">
		<div class="w-full mw-lg space-y-4">
			<h1 class="text-center font-xl">News Feed Eradicator</h1>

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
							<SiteList />
						</Show>

						<Show when={state.page.get() === 'quotes'}>
							<QuotesTabPanel />
						</Show>
					</div>
				</nfe-tabs>
			</OptionsPageStateContext.Provider>
		</div>
	</div>
}

render(h(OptionsPage), document.querySelector("#root")!);
