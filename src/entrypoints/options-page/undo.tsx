import { Show } from "solid-js";
import { useOptionsPageState } from "./state"
import { undoDeleteQuote, undoDeleteQuoteList } from "../../storage/storage";

export const Undo = () => {
	const state = useOptionsPageState();

	const undo = async () => {
		const undoState = state.undo.get();
		if (undoState == null) return;
		switch (undoState.type) {
			case 'deleteQuote':
				await undoDeleteQuote(undoState.quoteListId, undoState.quote)
				state.selectedQuoteList.refetch();
				break;
			case 'deleteQuoteList':
				await undoDeleteQuoteList(undoState.quoteList);
				state.quoteLists.refetch();
				break;
		}
		state.undo.set(null);
	}

	const clear = () => {
		state.undo.set(null);
	}

	const undoMessage = () => {
		const undoState = state.undo.get();
		if (undoState == null) return;
		switch (undoState.type) {
			case 'deleteQuote':
				return `Deleted quote by ${undoState.quote.author}`;
			case 'deleteQuoteList':
				return `Deleted list ${undoState.quoteList.title}`;
		}
	}

	return <Show when={state.undo.get() != null}>
		<div class="flex space-x-2 p-4 bg-lighten-100">
			<p class="flex-1">{undoMessage()}</p>
			<button onClick={undo}>Undo</button>
			<button onClick={clear}>x</button>
		</div>
	</Show>
}
