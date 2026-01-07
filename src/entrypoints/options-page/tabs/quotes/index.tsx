import { Show } from "solid-js"
import { QuotesToggle } from "./quotes-toggle"
import { ImportExport } from "./import-export"
import { useOptionsPageState } from "/entrypoints/options-page/state"

export const QuotesTabContent = () => {
	const state = useOptionsPageState();

	return <div class="">
		<QuotesToggle />
		<Show when={!state.hideQuotes.get()}>
			<hr />
			<ImportExport />
		</Show>
	</div>
}
