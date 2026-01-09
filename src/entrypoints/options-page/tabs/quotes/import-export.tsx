import { For, Show } from "solid-js";
import { generateId } from "/lib/generate-id";
import { BuiltinQuotes, type Quote } from "/quote";
import type { QuoteList, QuoteListId } from "/storage/schema";
import { saveNewQuoteList, saveQuoteListEnabled } from "/storage/storage";
import Papa from 'papaparse';
import { useOptionsPageState } from "/entrypoints/options-page/state";
import { QuoteListEditor } from "./quote-list";

export const ImportExport = () => {
	const state = useOptionsPageState();

	const doImport = async (files: FileList | null) => {
		if (files == null || files.length === 0) {
			return;
		}

		for (const file of files) {
			const text = await file.text();

			const result = Papa.parse(text, {
				header: false,            // We'll parse the header ourselves
				skipEmptyLines: 'greedy', // Skip lines with no content
				dynamicTyping: false,     // Always parse as strings
			});

			let quoteColumn: number | null = null
			let authorColumn: number | null = null
			let hideColumn: number | null = null

			if (result.data.length < 1) {
				return;
			}

			const headerRow = result.data[0] as any[];
			const cell = (row: number, col: number): string => (result.data[row] as any[])[col];

			for (let col = 0; col < headerRow.length; col += 1) {
				const column = headerRow[col].trim().toLowerCase();

				if (column === 'quote' || column === 'text' || column === 'content') {
					quoteColumn = col;
				}

				if (column === 'author' || column === 'source') {
					authorColumn = col;
				}

				if (column === 'hide') {
					hideColumn = col;
				}
			}

			if (quoteColumn == null) {
				console.error('Missing column header "quote"');
				break;
			}
			if (authorColumn == null) {
				console.error('Missing column header "author"');
				break;
			}

			let importedQuotes: Quote[] = [];
			let disabledQuoteIds: string[] = [];
			for (let row = 1; row < result.data.length; row += 1) {
				const id: string = generateId();

				const text = ((result.data[row] as string[])[quoteColumn] ?? '').trim();
				if (text === '') continue;

				const author = ((result.data[row] as string[])[authorColumn] ?? '').trim();

				if (hideColumn != null) {
					const hide = ((result.data[row] as string[])[hideColumn] ?? '').trim();
					if (hide === 'true') {
						disabledQuoteIds.push(id);
					}
				}

				const quote = { id, text, author };

				importedQuotes.push(quote);
			}

			await saveNewQuoteList({ title: file.name, quotes: importedQuotes, imported: true, disabledQuoteIds });
		}

		state.quoteLists.refetch();
	}

	return <div class="flex">
		<div class={`space-y-2 py-2 ${state.selectedQuoteList() == null ? 'flex-1' : 'br-1 mw-xs'}`}>
			<div class="px-4 flex cross-center gap-4">
				<h2 class="font-lg font-bold flex-1">Lists</h2>
				<div class="flex gap-2 cross-center">
					<label for="file-import-field" class="buttonlike font-sm tertiary user-select-none">Import CSV</label>
					<input id="file-import-field" type="file" class="none" multiple accept=".csv" onChange={e => doImport(e.currentTarget.files)} />
					<button class={`${state.selectedQuoteListId.get() == null ? 'primary' : 'secondary'} font-sm`} onClick={() => state.newQuoteList()}>+ New</button>
				</div>
			</div>
			<ul>
				<For each={state.quoteLists.get()}>
					{(ql) =>
						<>
							<QuoteListToggle quoteList={ql} />
						</>
					}
				</For>
			</ul>
		</div>
		<Show when={state.selectedQuoteList() != null}>
			<div class="viewport-scroller p-4 flex-1">
				<QuoteListEditor />
			</div>
		</Show>
	</div>
}

const QuoteListToggle = ({ quoteList: ql }: { quoteList: QuoteList }) => {
	const state = useOptionsPageState();

	const onQuoteListToggle = async (e: { preventDefault: () => void }, id: QuoteListId, currentlyEnabled: boolean) => {
		if (!currentlyEnabled) {
			state.selectedQuoteListId.set(id);
			await saveQuoteListEnabled(id, true);
			state.quoteLists.refetch();
			return;
		}

		if (state.selectedQuoteListId.get() !== id) {
			e.preventDefault();
			state.selectedQuoteListId.set(id);
		} else {
			state.selectedQuoteListId.set(null);
			await saveQuoteListEnabled(id, false);
			state.quoteLists.refetch();
		}
	}

	// const bg = () => state.selectedQuoteListId.get() === ql.id ? 'bg-accent-a200' : 'hover:bg-lighten-100';

	return <li class={`flex px-4 hoverable`} aria-selected={state.selectedQuoteListId.get() === ql.id}>
		<label class="cursor-pointer flex flex-1 cross-center py-2" for={`quotelist-${ql.id}`}>
			<input type="checkbox" class="toggle" checked={!ql.disabled} id={`quotelist-${ql.id}`} onClick={e => onQuoteListToggle(e, ql.id, !ql.disabled)} />
			<span class="px-2">{ql.id === 'builtin' ? 'Built-in quotes' : ql.title} ({ ql.quotes === 'builtin' ? BuiltinQuotes.length : ql.quotes.length })</span>
		</label>
	</li>
}

// <button onClick={() => state.selectedQuoteListId.set(ql.id)}>Edit</button>
// <button onClick={() => doExport(ql.id)}>Export</button>
