import { useOptionsPageState } from "./state";

export const QuotesToggle = () => {
	const state = useOptionsPageState();

	return (
		<div>
			<label for="show-quotes-toggle" class="flex cross-center space-x-1 cursor-pointer">
				<input type="checkbox" class="toggle" id="show-quotes-toggle" checked={!state.hideQuotes.get()} onChange={() => state.setHideQuotes(!state.hideQuotes.get())} />
				<span>Show quotes</span>
			</label>
		</div>
	);
};
