import { Show } from "solid-js"
import { QuotesToggle } from "./quotes-toggle"
import { QuoteListManager } from "./quote-list-manager"
import { useOptionsPageState } from "/entrypoints/options-page/state"

export const QuotesTabContent = () => {
	const state = useOptionsPageState();

	return <div class="">
		<QuotesToggle />
		<Show when={!state.storage.hideQuotes.get()}>
			<hr />
			<QuoteListManager />
		</Show>
	</div>
}
