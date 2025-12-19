import { createEffect, createMemo, createResource, createSignal, For, Show, type Accessor, type Setter } from "solid-js"
import { loadQuoteList, loadQuoteLists, saveQuote, saveQuoteEnabled } from "../../storage/storage";
import { BuiltinQuotes, type Quote } from "../../quote";
import { sendToServiceWorker } from "../../messaging/messages";
import { useOptionsPageState, type OptionsPageState } from "./state";
import { generateId } from "../../lib/generate-id";

const compareByAuthor = (a: Quote, b: Quote) => {
	if (a.author < b.author) return -1;
	if (a.author > b.author) return 1;

	if (a.text < b.text) return -1;
	if (a.text > b.text) return 1;

	return 0;
}

export const QuoteListEditor = () => {
	const state = useOptionsPageState();

	createEffect(() => {
		console.log('quote list id is ', state.selectedQuoteListId.get());
	});

	const [quoteList, { refetch }] = createResource(state.selectedQuoteListId.get, async (qlId) => {
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

		refetch();
	};

	const editQuote = (id: string) => {
		state.editing.set({
			type: 'existingQuote',
			existingQuoteId: id,
		});
	};

	const editingQuoteId = () => {
		const es = state.editing.get();
		if (es == null) return null;
		if (es.type !== 'existingQuote') return null;
		return es.existingQuoteId;
	}

	return  <div>
		<h2>Quotes</h2>

		<button onClick={() => state.editing.set({type: 'newQuote'})}>Add Quote</button>

		<table>
			<Show when={state.editing.get()?.type == 'newQuote'}>
				<QuoteEditor quote={null} afterSave={refetch} />
			</Show>

			<For each={quotes()}>
				{quote => <>
					<Show when={editingQuoteId() === quote.id}>
						<QuoteEditor quote={quote} afterSave={refetch} />
					</Show>

					<Show when={editingQuoteId() !== quote.id}>
						<tr>
							<td>
								<input type="checkbox" class="checkbox" id={`quote-${quote.id}`} checked={!disabledQuoteIds().has(quote.id)} onChange={e => setQuoteEnabled(quote.id, e.currentTarget.checked)} />
							</td>
							<td><label class="cursor-pointer" for={`quote-${quote.id}`}>{quote.text}</label><button onClick={() => editQuote(quote.id)}>Edit</button></td>
							<td>{quote.author}</td>
						</tr>
					</Show>
				</>
				}
			</For>
		</table>
	</div>
}

const QuoteEditor = ({ quote, afterSave }: { quote: Quote | null, afterSave: () => void }) => {
	const state = useOptionsPageState();

	const [editingQuoteText, setEditingQuoteText] = createSignal<string>(quote?.text ?? '');
	const [editingQuoteAuthor, setEditingQuoteAuthor] = createSignal<string>(quote?.author ?? '');

	const cancel = async () => {
		state.editing.set(null);
		afterSave();
	}

	const save = async (addAnother: boolean) => {
		if (quote?.text.trim() === '') {
			return;
		}

		const quoteId = quote == null ? generateId() : quote.id;

		await saveQuote(state.selectedQuoteListId.get()!, quoteId, editingQuoteText(), editingQuoteAuthor());

		if (addAnother) {
			setEditingQuoteText('');
			setEditingQuoteAuthor('');
		} else {
			state.editing.set(null);
		}
		afterSave();
	}

	return <tr>
		<td colspan="3">
			<form onSubmit={e => {
				e.preventDefault();
				save(false);
			}}>
				<div>
					<label>Quote text</label>
					<input type="text" value={editingQuoteText()} onInput={e => setEditingQuoteText(e.currentTarget.value)} />
				</div>

				<div>
					<label>Author</label>
					<input type="text" value={editingQuoteAuthor()} onInput={e => setEditingQuoteAuthor(e.currentTarget.value)} />
				</div>

				<button type="button" onClick={cancel}>
					Cancel
				</button>
				<button type="submit">
					Save
				</button>
				<button type="button" onClick={e => save(true)}>
					Save and add another
				</button>
			</form>
		</td>
	</tr>
}
