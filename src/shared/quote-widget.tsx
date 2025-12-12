import { createResource, Show, type Accessor } from "solid-js"
import { type RequestQuoteResponse, sendToServiceWorker } from "../messaging/messages"
import type { Theme } from "../storage/schema";
import type { SiteId } from "../types/sitelist";

const [quote, { refetch: nextQuote }] = createResource(async () => {
	return sendToServiceWorker<RequestQuoteResponse>({
		type: 'requestQuote'
	});
})

const disableQuote = async () => {
	const q = quote();
	if (q == null) return;

	await sendToServiceWorker({
		type: 'removeQuote',
		id: q.id,
	});
	nextQuote();
}

const toggleTheme = async (siteId: SiteId, theme: Theme) => {
	await sendToServiceWorker({
		type: 'setSiteTheme',
		siteId,
		theme: theme === 'light' ? 'dark' : 'light',
	})
}

export const QuoteWidget = ({ siteId, theme }: { siteId: SiteId | null, theme: Accessor<Theme | null> }) => {
	return <div class="p-4 space-y-2 bg-ground-100 b-1">
		<Show when={quote()}>
			<div class="space-x-2">
				<button class="bg-transparent hover:bg-figure-100 text-primary p-2 b-0 cursor-pointer" onClick={nextQuote}>&gt;</button>
				<button class="bg-transparent hover:bg-figure-100 text-primary p-2 b-0 cursor-pointer" onClick={disableQuote}>Disable this quote</button>
				<Show when={siteId != null}>
					<button class="bg-transparent hover:bg-figure-100 text-primary p-2 b-0 cursor-pointer" onClick={() => toggleTheme(siteId!, theme() ?? 'light')}>Theme {theme()}</button>
				</Show>
			</div>
			<div class="quote-border-left p-2 text-primary">{quote()?.text}</div>
			<div class="text-secondary">{quote()?.source}</div>
		</Show>
	</div>
}
