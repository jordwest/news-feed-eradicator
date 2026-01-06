import { createMemo, createSignal, For, Show } from "solid-js"
import { deleteQuoteList, saveQuote, saveQuoteListTitle, deleteQuote as storageDeleteQuote } from "/storage/storage";
import { BuiltinQuotes, type Quote } from "/quote";
import { sendToServiceWorker } from "/messaging/messages";
import { signalObj, useOptionsPageState } from "/entrypoints/options-page/state";
import { generateId } from "/lib/generate-id";
import { expect, quotesByAuthor } from "/lib/util";
import { BUILTIN_QUOTE_LIST_ID } from "/storage/schema";
import { unwrap } from "solid-js/store";

const autoFocus = ({ autoSelect }: { autoSelect?: boolean } = {}) => (el: HTMLElement) => {
	setTimeout(() => {
		el.focus();
		if (autoSelect && (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) {
			el.select();
		}
	}, 1)
}

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

	const isEditable = () => state.selectedQuoteList()?.quotes !== 'builtin';

	return <div class="space-y-4">
		<Show when={state.withEditingType('quoteListTitle')} keyed>
			{editState =>
				<div class="flex cross-center gap-2">
					<input class="p-2 w-full" ref={autoFocus({autoSelect: true})} type="text" value={editState.editValue.get()} onInput={e => editState.editValue.set(e.currentTarget.value)} />
					<button class="primary" onClick={async () => {
						await saveQuoteListTitle(editState.quoteListId, editState.editValue.get())
						state.editing.set(null);
						state.quoteLists.refetch();
					}}>Save</button>
					<button class="tertiary" onClick={() => state.editing.set(null)}>Cancel</button>
				</div>
			}
		</Show>
		<Show when={state.withEditingType('quoteListTitle') == null}>
			<Show when={state.selectedQuoteListId.get() === BUILTIN_QUOTE_LIST_ID}>
				<h3 class="font-xl">Built-in quotes</h3>
			</Show>
			<Show when={isEditable()}>
				<div class="flex cross-center gap-2">
					<h3 class="font-xl">{ state.selectedQuoteList()?.title }</h3>
					<button class="tertiary bg-transparent font-sm" onClick={editListTitle} aria-label="Edit list title">✏️</button>
					<button class="tertiary font-sm" onClick={deleteList}>Delete list</button>
					<div class="flex-1" />
					<button class="primary font-sm" onClick={() => state.editing.set({type: 'newQuote'})}>Add Quote</button>
				</div>
			</Show>
		</Show>


		<ul class="space-y-2">
			<Show when={state.editing.get()?.type == 'newQuote'}>
				<QuoteEditor quote={null} afterSave={state.quoteLists.refetch} />
			</Show>

			<For each={quotes()}>
				{quote => <>
					<Show when={editingQuoteId() === quote.id}>
						<QuoteEditor quote={quote} afterSave={state.quoteLists.refetch} />
					</Show>

					<Show when={editingQuoteId() !== quote.id}>
						<li class="flex gap-2 card cross-center">
							<label class="flex-1 hoverable block cursor-pointer p-2 flex gap-2 cross-center" for={`quote-${quote.id}`}>
								<input type="checkbox" class="checkbox" id={`quote-${quote.id}`} checked={!disabledQuoteIds().has(quote.id)} onChange={e => setQuoteEnabled(quote.id, e.currentTarget.checked)} />
								<figure>
									<blockquote>{quote.text}</blockquote>
									<figcaption>{quote.author}</figcaption>
								</figure>
							</label>
								<Show when={isEditable()}>
									<div class="p-2 space-x-2">
										<button class="tertiary font-sm" onClick={() => editQuote(quote.id)}>✏️</button>
										<button class="tertiary font-sm" onClick={() => deleteQuote(quote.id)}>❌</button>
									</div>
								</Show>
						</li>
					</Show>
				</>
				}
			</For>
		</ul>
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

	return <li>
			<form onSubmit={e => {
				e.preventDefault();
				save(false);
			}}>
				<div class="space-y-4 card outlined shadow p-4">
					<div class="space-y-2">
						<div>
							<label class="block">Quote text</label>
							<textarea ref={autoFocus()} rows={5} class="w-full p-2" onInput={e => setEditingQuoteText(e.currentTarget.value)} value={editingQuoteText()} />
						</div>

						<div>
							<label class="block">Author</label>
							<input type="text" class="w-full p-2" value={editingQuoteAuthor()} onInput={e => setEditingQuoteAuthor(e.currentTarget.value)} />
						</div>
					</div>

					<div class="space-x-2">
						<button class="primary" type="submit">
							Save
						</button>
						<Show when={quote == null}>
							<button class="secondary" type="button" onClick={e => save(true)}>
								Save and add another
							</button>
						</Show>
						<button class="tertiary" type="button" onClick={cancel}>
							Cancel
						</button>
					</div>
				</div>
			</form>
	</li>
}
