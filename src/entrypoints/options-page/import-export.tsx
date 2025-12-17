import { generateId } from "../../lib/generate-id";
import type { CustomQuote } from "../../quote";
import { appendCustomQuotes, loadCustomQuotes } from "../../storage/storage";
import Papa from 'papaparse';

export const ImportExport = () => {
	const doExport = async () => {
		const quotes = await loadCustomQuotes();
		let file = `id,quote,author\n`;
		for (const quote of quotes) {
			file += [JSON.stringify(quote.id), JSON.stringify(quote.text), JSON.stringify(quote.source)].join(',') + '\n';
		}

		console.info(file);
	};

	const doImport = async (files: FileList | null) => {
		if (files == null || files.length === 0) {
			return;
		}

		const reader = new FileReader();
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

			console.log('id column', idColumn);

			let importedQuotes: CustomQuote[] = [];
			for (let row = 1; row < result.data.length; row += 1) {
				let id: string = idColumn != null ? cell(row, idColumn) : generateId();
				console.log('id', id);
				if (id.trim() === '') {
					id = generateId();
				}

				const text = ((result.data[row] as string[])[quoteColumn] ?? '').trim();
				if (text === '') continue;

				const source = ((result.data[row] as string[])[authorColumn] ?? '').trim();

				const quote = { id, text, source };

				importedQuotes.push(quote);
			}

			appendCustomQuotes(importedQuotes);
		}
	}

	return <div>
		<div><button onClick={doExport}>Export to CSV</button></div>
		<div>
			<input type="file" multiple accept=".csv" onChange={e => doImport(e.currentTarget.files)} />
		</div>
	</div>
}
