import { createEffect, createResource, Show, type Accessor } from "solid-js"
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
	// const currentTheme = await loadThemeForSite(site.id) ?? 'dark';

	// if (currentTheme === 'dark') {
	// 	saveThemeForSite(site.id, 'light');
	// } else {
	// 	saveThemeForSite(site.id, 'dark');
	// }
}

export const QuoteWidget = ({ siteId, theme }: { siteId: SiteId | null, theme: Accessor<Theme | null> }) => {
	return <div class="p-4 space-y-2">
		<Show when={quote()}>
			<button onClick={nextQuote}>&gt;</button>
			<button onClick={disableQuote}>Disable this quote</button>
			<Show when={siteId != null}>
				<button onClick={() => toggleTheme(siteId!, theme() ?? 'light')}>Theme {theme()}</button>
			</Show>
			<div class="quote-border-left p-2">{quote()?.text}</div>
			<div class="text-secondary">{quote()?.source}</div>
		</Show>
	</div>
}
