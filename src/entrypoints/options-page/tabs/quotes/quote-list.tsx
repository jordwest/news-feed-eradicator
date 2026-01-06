import { createMemo, createSignal, For, Show } from "solid-js"
import { deleteQuoteList, saveQuote, saveQuoteListTitle, deleteQuote as storageDeleteQuote } from "/storage/storage";
import { BuiltinQuotes, type Quote } from "/quote";
import { sendToServiceWorker } from "/messaging/messages";
import { signalObj, useOptionsPageState } from "/entrypoints/options-page/state";
import { generateId } from "/lib/generate-id";
import { expect, quotesByAuthor } from "/lib/util";
import { BUILTIN_QUOTE_LIST_ID } from "/storage/schema";
import { unwrap } from "solid-js/store";

export const QuoteListEditor = () => {
	const state = useOptionsPageState();

	const quotes = createMemo(() => {
		const ql = state.selectedQuoteList();
		if (ql == null) return [];
		return (ql?.quotes === 'builtin' ? BuiltinQuotes : ql.quotes)
			.sort(quotesByAuthor);
	});

	const disabledQuoteIds = createMemo(() => {
		const ql = state.selectedQuoteList();
		return new Set(ql == null ? [] : ql.disabledQuoteIds);
	});

	const setQuoteEnabled = async (id: string, enabled: boolean) => {
		const ql = state.selectedQuoteList();
		if (ql == null) return;

		await sendToServiceWorker({
			type: 'setQuoteEnabled',
			quoteListId: ql.id,
			id,
			enabled,
		});

		state.quoteLists.refetch();
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

	const editListTitle = () => {
		state.editing.set({
			type: 'quoteListTitle',
			editValue: signalObj(state.selectedQuoteList()?.title ?? ''),
			quoteListId: expect(state.selectedQuoteList()).id,
		});
	};

	const deleteList = async () => {
		const ql = state.selectedQuoteList();
		if (ql == null || ql.quotes == 'builtin') return;

		await deleteQuoteList(expect(state.selectedQuoteList()).id);

		state.undo.set({
			type: 'deleteQuoteList',
			quoteList: unwrap(ql),
		});

		state.selectedQuoteListId.set(null);
		state.quoteLists.refetch();
	}

	const deleteQuote = async (id: string) => {
		const ql = state.selectedQuoteList();
		if (ql == null || ql.quotes == 'builtin') return;
		const quote = ql.quotes.find(q => q.id === id);
		if (quote == null) return;

		await storageDeleteQuote(ql.id, id);
		state.editing.set(null);

		state.undo.set({
			type: 'deleteQuote',
			quoteListId: ql.id,
			quote: unwrap(quote),
		});
		state.quoteLists.refetch();
	}

	return <div>
		<Show when={state.withEditingType('quoteListTitle')} keyed>
			{editState =>
				<div>
					<input type="text" value={editState.editValue.get()} onInput={e => editState.editValue.set(e.currentTarget.value)} />
					<button onClick={async () => {
						await saveQuoteListTitle(editState.quoteListId, editState.editValue.get())
						state.editing.set(null);
						state.quoteLists.refetch();
					}}>Save</button>
				</div>
			}
		</Show>
		<Show when={state.withEditingType('quoteListTitle') == null}>
			<Show when={state.selectedQuoteListId.get() === BUILTIN_QUOTE_LIST_ID}>
				<h3 class="font-xl">Built-in quotes</h3>
			</Show>
			<Show when={state.selectedQuoteListId.get() !== BUILTIN_QUOTE_LIST_ID}>
				<h3 class="font-xl">{ state.selectedQuoteList()?.title } <button onClick={editListTitle}>Edit</button><button onClick={deleteList}>Delete list</button></h3>
			</Show>
		</Show>

		<button onClick={() => state.editing.set({type: 'newQuote'})}>Add Quote</button>

		<table>
			<Show when={state.editing.get()?.type == 'newQuote'}>
				<QuoteEditor quote={null} afterSave={state.quoteLists.refetch} />
			</Show>

			<For each={quotes()}>
				{quote => <>
					<Show when={editingQuoteId() === quote.id}>
						<QuoteEditor quote={quote} afterSave={state.quoteLists.refetch} />
					</Show>

					<Show when={editingQuoteId() !== quote.id}>
						<tr>
							<td>
								<input type="checkbox" class="checkbox" id={`quote-${quote.id}`} checked={!disabledQuoteIds().has(quote.id)} onChange={e => setQuoteEnabled(quote.id, e.currentTarget.checked)} />
							</td>
							<td><label class="cursor-pointer" for={`quote-${quote.id}`}>{quote.text}</label>
								<button onClick={() => editQuote(quote.id)}>Edit</button>
								<button onClick={() => deleteQuote(quote.id)}>Delete</button>
							</td>
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
		const quoteListId = expect(state.selectedQuoteListId.get());

		await saveQuote(quoteListId, quoteId, editingQuoteText(), editingQuoteAuthor());

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
