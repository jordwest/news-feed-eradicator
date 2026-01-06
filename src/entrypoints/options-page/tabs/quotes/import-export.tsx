import { For } from "solid-js";
import { generateId } from "/lib/generate-id";
import { BuiltinQuotes, type Quote } from "/quote";
import type { QuoteListId } from "/storage/schema";
import { loadQuoteList, saveNewQuoteList, saveQuoteListEnabled } from "/storage/storage";
import Papa from 'papaparse';
import { useOptionsPageState } from "/entrypoints/options-page/state";
import { downloadFile } from "/lib/util";

export const ImportExport = () => {
	const state = useOptionsPageState();

	const doExport = async (quoteListId: QuoteListId) => {
		const quoteList = await loadQuoteList(quoteListId);
		if (quoteList == null) return;

		const quotes = quoteList.quotes === 'builtin' ? BuiltinQuotes : quoteList.quotes;

		const file = Papa.unparse([
			['id', 'quote', 'author'],
			...quotes.map(quote => [quote.id, quote.text, quote.author])
		])

		const blob = new Blob([file], { type: 'text/csv' });
		let filename = quoteList.title.trim().replace(' ', '-').toLocaleLowerCase();
		if (filename === '') filename = 'quotes';
		if (!filename.endsWith('.csv')) filename += '.csv';

		downloadFile(blob, filename);
	};

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

			let idColumn: number | null = null
			let quoteColumn: number | null = null
			let authorColumn: number | null = null

			if (result.data.length < 1) {
				return;
			}

			const headerRow = result.data[0] as any[];
			const cell = (row: number, col: number): string => (result.data[row] as any[])[col];

			console.log(result.data);

			for (let col = 0; col < headerRow.length; col += 1) {
				const column = headerRow[col].trim().toLowerCase();

				if (column === 'id') {
					idColumn = col;
				}

				if (column === 'quote' || column === 'text' || column === 'content') {
					quoteColumn = col;
				}

				if (column === 'author' || column === 'source') {
					authorColumn = col;
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
			for (let row = 1; row < result.data.length; row += 1) {
				let id: string = idColumn != null ? cell(row, idColumn) : generateId();
				console.log('id', id);
				if (id.trim() === '') {
					id = generateId();
				}

				const text = ((result.data[row] as string[])[quoteColumn] ?? '').trim();
				if (text === '') continue;

				const author = ((result.data[row] as string[])[authorColumn] ?? '').trim();

				const quote = { id, text, author };

				importedQuotes.push(quote);
			}

			await saveNewQuoteList(file.name, importedQuotes, true);
		}

		state.quoteLists.refetch();
	}

	const setQuoteListEnabled = (id: QuoteListId, enabled: boolean) => {
		saveQuoteListEnabled(id, enabled);
	}

	return <div>
		<div>
			<For each={state.quoteLists.get()}>
				{(ql) => <div class="font-lg flex">
					<label class="cursor-pointer flex flex-1" for={`quotelist-${ql.id}`}>
						<input type="checkbox" class="toggle" checked={!ql.disabled} id={`quotelist-${ql.id}`} onClick={e => setQuoteListEnabled(ql.id, e.currentTarget.checked)} />
						<span class="p-1">{ql.id === 'builtin' ? 'Built-in quotes' : ql.title} ({ ql.quotes === 'builtin' ? BuiltinQuotes.length : ql.quotes.length })</span>
					</label>
					<button onClick={() => state.selectedQuoteListId.set(ql.id)}>Edit</button>
					<button onClick={() => doExport(ql.id)}>Export</button>
				</div>}
			</For>
		</div>
		<div>
			<label for="file-import-field" class="cursor-pointer b-1 user-select-none hover:bg-figure-100">Import CSV</label>
			<input id="file-import-field" type="file" class="opacity-0" multiple accept=".csv" onChange={e => doImport(e.currentTarget.files)} />
		</div>
	</div>
}
