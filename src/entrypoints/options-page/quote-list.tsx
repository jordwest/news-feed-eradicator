import { createEffect, createMemo, createResource, For, Show, type Accessor } from "solid-js"
import { loadQuoteList, loadQuoteLists } from "../../storage/storage";
import { BuiltinQuotes, type Quote } from "../../quote";
import { sendToServiceWorker } from "../../messaging/messages";
import type { QuoteListId } from "../../storage/schema";

const compareByAuthor = (a: Quote, b: Quote) => {
	if (a.author < b.author) return -1;
	if (a.author > b.author) return 1;

	if (a.text < b.text) return -1;
	if (a.text > b.text) return 1;

	return 0;
}

export const QuoteListEditor = ({ quoteListId }: { quoteListId: Accessor<QuoteListId | null | undefined> }) => {
	createEffect(() => {
		console.log('quote list id is ', quoteListId());
	});

	const [quoteList, { refetch }] = createResource(quoteListId, async (qlId) => {
		console.log('reevaluating resource', qlId)
		if (qlId == null) return null;
		return await loadQuoteList(qlId!);
	});

	const quotes = createMemo(() => {
		const ql = quoteList();
		if (ql == null) return [];
		return (ql?.quotes === 'builtin' ? BuiltinQuotes : ql.quotes)
			.sort(compareByAuthor);
	});

	const disabledQuoteIds = createMemo(() => {
		const ql = quoteList();
		return new Set(ql == null ? [] : ql.disabledQuoteIds);
	});

	const setQuoteEnabled = async (id: string, enabled: boolean) => {
		const ql = quoteList();
		if (ql == null) return;

		await sendToServiceWorker({
			type: 'setQuoteEnabled',
			quoteListId: ql.id,
			id,
			enabled,
		});

		console.log(enabled);

		refetch();
	};

	return  <div>
		<h2>Quotes</h2>

		<table>
			<For each={quotes()}>
				{quote => <tr>
					<td>
						<input type="checkbox" class="checkbox" id={`quote-${quote.id}`} checked={!disabledQuoteIds().has(quote.id)} onChange={e => setQuoteEnabled(quote.id, e.currentTarget.checked)} />
					</td>
					<td><label class="cursor-pointer" for={`quote-${quote.id}`}>{quote.text}</label></td>
					<td>{quote.author}</td>
				</tr>}
			</For>
		</table>
	</div>
}
