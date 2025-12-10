import { createResource, For } from "solid-js"
import { loadHiddenBuiltinQuotes } from "../../storage/storage";
import { BuiltinQuotes, type BuiltinQuote } from "../../quote";
import { sendToServiceWorker } from "../../messaging/messages";

const compareBySource = (a: BuiltinQuote, b: BuiltinQuote) => {
	if (a.source < b.source) return -1;
	if (a.source > b.source) return 1;

	if (a.text < b.text) return -1;
	if (a.text > b.text) return 1;

	return 0;
}

const [hiddenQuotes, { refetch }] = createResource(async () => {
	const hiddenIds = await loadHiddenBuiltinQuotes()
	const quotes = BuiltinQuotes;

	return quotes.filter(quote => hiddenIds.includes(quote.id)).sort(compareBySource)
});

const reenableQuote = async (id: number) => {
	await sendToServiceWorker({
		type: 'reenableBuiltinQuote',
		id,
	});

	refetch();
};

export const HiddenQuotes = () => {
	return  <div>
		<h2>Hidden quotes</h2>
		<table>
			<For each={hiddenQuotes()}>
				{quote => <tr>
					<td>{quote.text}</td>
					<td>{quote.source}</td>
					<td><button onClick={() => reenableQuote(quote.id)}>Re-enable</button></td>
				</tr>}
			</For>
		</table>
	</div>
}
