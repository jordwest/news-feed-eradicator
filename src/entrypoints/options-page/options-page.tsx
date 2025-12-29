import { getBrowser, type Permissions } from "../../lib/webextension";

import { render } from "solid-js/web";
import h from "solid-js/h";
import { Show, type ParentComponent } from "solid-js";

import { ImportExport } from "./import-export";
import { QuoteListEditor } from "./quote-list";
import { OptionsPageState, OptionsPageStateContext, useOptionsPageState, type PageId } from "./state";
import { Snooze } from "./snooze";
import { SiteList } from "./sites";
import { Undo } from "./undo";
import { QuotesToggle } from "./quotes-toggle";

const PageTab: ParentComponent<{to: PageId}> = ({ to, children }) => {
	const state = useOptionsPageState();

	const classname = () => {
		const active = state.page.get() === to ? 'underline bg-lighten-100' : 'bg-darken-100 hover:bg-darken-50'
		return `block font-xl py-2 px-4 ${active}`
	};

	return <li><button class={classname()} onClick={() => state.page.set(to)}>{children}</button></li>;
}

const PageTabs = () => {
	return <nav>
		<ul class="flex font-xl axis-center">
			<PageTab to="sites">Sites</PageTab>
			<PageTab to="quotes">Quotes</PageTab>
			<PageTab to="about">About</PageTab>
		</ul>
	</nav>
}

const OptionsPage = () => {
	const state = new OptionsPageState();

	return <div class="flex axis-center text-figure">
		<div class="font-lg w-full mw-lg space-y-4">
			<h1 class="text-center font-xl">News Feed Eradicator</h1>

			<OptionsPageStateContext.Provider value={state}>
				<Snooze />

				<Undo />

				<Show when={!state.allSitePermissionsValid()}>
					<div class="flex p-4 shadow bg-lighten-100">
						<p class="flex-1">Some enabled sites need more permissions to work correctly.</p>
						<button onClick={() => state.fixPermissions()}>Fix permissions</button>
					</div>
				</Show>

				<div>
					<PageTabs />
					<div class="bg-lighten-100">
						<Show when={state.page.get() === 'sites'}>
							<SiteList />
						</Show>

						<Show when={state.page.get() === 'quotes'}>
							<QuotesToggle />
							<Show when={!state.hideQuotes.get()}>
								<hr />
								<ImportExport />
								<Show when={state.selectedQuoteListId.get() != null}>
									<QuoteListEditor />
								</Show>
							</Show>
						</Show>
					</div>
				</div>
			</OptionsPageStateContext.Provider>
		</div>
	</div>
}

render(h(OptionsPage), document.querySelector("#root")!);
