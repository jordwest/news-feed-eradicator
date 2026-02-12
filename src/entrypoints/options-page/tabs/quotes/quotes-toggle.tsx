import { useOptionsPageState } from "/entrypoints/options-page/state";

export const QuotesToggle = () => {
	const state = useOptionsPageState();

	return (
		<div>
			<label for="show-quotes-toggle" class="flex cross-center cursor-pointer p-4 hoverable">
				<input type="checkbox" class="toggle" id="show-quotes-toggle" checked={!state.storage.hideQuotes.get()} onChange={() => state.storage.setHideQuotes(!state.storage.hideQuotes.get())} />
				<span class="px-2 py-1">Enable quotes</span>
			</label>
		</div>
	);
};
