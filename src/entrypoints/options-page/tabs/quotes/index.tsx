import { Show } from "solid-js"
import { QuotesToggle } from "./quotes-toggle"
import { ImportExport } from "./import-export"
import { QuoteListEditor } from "./quote-list"
import { useOptionsPageState } from "/entrypoints/options-page/state"

export const QuotesTabPanel = () => {
	const state = useOptionsPageState();

	return <div class="p-4">
		<QuotesToggle />
		<Show when={!state.hideQuotes.get()}>
			<hr />
			<ImportExport />
			<Show when={state.selectedQuoteListId.get() != null}>
				<QuoteListEditor />
			</Show>
		</Show>
	</div>
}
