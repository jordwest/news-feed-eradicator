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

	return <li><a href="#" class={state.page.get() === to ? 'decoration-underline' : ''} onClick={() => state.page.set(to)}>{children}</a></li>;
}

const PageTabs = () => {
	return <nav>
		<ul class="flex space-x-2 font-xl p-4 axis-center">
			<PageTab to="sites">Sites</PageTab>
			<span>|</span>
			<PageTab to="quotes">Quotes</PageTab>
			<span>|</span>
			<PageTab to="about">About</PageTab>
		</ul>
	</nav>
}

const OptionsPage = () => {
	const state = new OptionsPageState();

	return <div class="flex axis-center text-figure">
		<div class="font-lg w-full mw-lg">
			<h1 class="text-center font-xl">News Feed Eradicator</h1>

			<OptionsPageStateContext.Provider value={state}>
				<Snooze />

				<Undo />

				<PageTabs />

				<div class="shadow">
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
			</OptionsPageStateContext.Provider>
		</div>
	</div>
}

render(h(OptionsPage), document.querySelector("#root")!);
