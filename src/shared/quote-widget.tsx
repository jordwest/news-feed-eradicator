import { createResource, Show, type Accessor } from "solid-js"
import { type RequestQuoteResponse, sendToServiceWorker } from "../messaging/messages"
import type { Theme } from "../storage/schema";
import type { SiteId } from "../types/sitelist";
import { createSignal } from "solid-js";

const [quote, { refetch: nextQuote }] = createResource(async () => {
	return sendToServiceWorker<RequestQuoteResponse>({
		type: 'requestQuote'
	});
})

const disableQuote = async () => {
	const q = quote();
	if (q == null) return;

	await sendToServiceWorker({
		type: 'setQuoteEnabled',
		quoteListId: q.quoteListId,
		id: q.id,
		enabled: false,
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
	const [collapsed, setCollapsed] = createSignal(false);

	return <div class="p-4 bg-widget-ground b-1 shadow">
		<Show when={quote()}>
			<div class="w-full position-relative">
				<div class={`space-x-2 flex ${collapsed() ? 'position-absolute lr-0 pointer-events-none' : 'w-full'}`}>
					<Show when={!collapsed()}>
						<button class="bg-transparent hover:bg-figure-100 text-primary p-2 b-0 cursor-pointer" onClick={nextQuote}>&gt;</button>
						<button class="bg-transparent hover:bg-figure-100 text-primary p-2 b-0 cursor-pointer" onClick={disableQuote}>Disable this quote</button>
						<Show when={siteId != null}>
							<button class="bg-transparent hover:bg-figure-100 text-primary p-2 b-0 cursor-pointer" onClick={() => toggleTheme(siteId!, theme() ?? 'light')}>Theme {theme()}</button>
						</Show>
					</Show>
					<div class="flex-1" />
					<button class="bg-transparent hover:bg-figure-100 text-primary p-2 b-0 cursor-pointer pointer-events-all" onClick={() => setCollapsed(!collapsed())}>{collapsed() ? '<<' : 'Hide toolbar'}</button>
				</div>
			</div>
			<div class={`space-y-2 ${collapsed() ? 'pr-8' : ''}`}>
				<div class="quote-border-left p-2 text-primary">{quote()?.text}</div>
				<div class="text-secondary">{quote()?.author}</div>
			</div>
		</Show>
	</div>
}
