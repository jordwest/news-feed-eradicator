import { createResource, Show, type Accessor } from "solid-js"
import { type RequestQuoteResponse, sendToServiceWorker } from "../messaging/messages"
import type { Theme } from "../storage/schema";
import type { SiteId } from "../types/sitelist";
import { createSignal } from "solid-js";
import { getBrowser } from "/lib/webextension";
import { loadHideWidgetToolbar, saveHideWidgetToolbar } from "/storage/storage";

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

const toggleTheme = async (e: { preventDefault: () => void }, siteId: SiteId, theme: Theme) => {
	e.preventDefault();
	await sendToServiceWorker({
		type: 'setSiteTheme',
		siteId,
		theme: theme === 'light' ? 'dark' : 'light',
	})
}

export const QuoteWidget = ({ siteId, theme }: { siteId: SiteId | null, theme: Accessor<Theme | null> }) => {
	const [collapsed, setCollapsedLocal] = createSignal(true);

	loadHideWidgetToolbar().then(hidden => setCollapsedLocal(hidden));

	const setCollapsed = (collapsed: boolean) => {
			saveHideWidgetToolbar(collapsed);
			setCollapsedLocal(collapsed);
	}

	return <aside class="space-y-2">
		<div class="p-4 bg-widget-ground b-1 shadow space-y-2 font-md">
			<Show when={quote()}>
				<div class="w-full position-relative">
					<Show when={collapsed()}>
						<div class="flex w-full axis-end position-absolute lr-0 pointer-events-none">
							<button class="tertiary px-2 pointer-events-all" aria-label="Show News Feed Eradicator toolbar" onClick={() => setCollapsed(false)}>︙</button>
						</div>
					</Show>
					<Show when={!collapsed()}>
						<div class="space-x-4 flex w-full">
							<div class="space-x-2 flex-1 flex">
								<button class="tertiary text-primary font-sm" onClick={nextQuote}>Next quote &gt;</button>
								<button class="secondary text-primary font-sm" onClick={disableQuote}>Disable this quote</button>
								<div class="flex-1" />
								<Show when={siteId != null}>
									<label for="theme-toggle" class="cursor-pointer text-primary gap-1 flex cross-center">
										<span aria-label="Light mode">☀️</span>
										<input id="theme-toggle" type="checkbox" checked={theme() === 'dark'} class="toggle" onInput={e => toggleTheme(e, siteId!, theme() ?? 'light')} />
										<span aria-label="Dark mode">🌙</span>
									</label>
								</Show>
							</div>
							<button class="primary px-2 pointer-events-all font-sm" onClick={() => setCollapsed(true)}>Hide toolbar</button>
						</div>
					</Show>
				</div>
				<div class={`space-y-2 font-lg ${collapsed() ? 'pr-8' : ''}`}>
					<div class="quote-border-left p-2 text-primary">{quote()?.text}</div>
					<div class="text-secondary">{quote()?.author}</div>
				</div>
			</Show>
		</div>
		<footer class="flex axis-center">
				<button class="font-xs tertiary bg-transparent text-subtle text-shadow" onClick={() => sendToServiceWorker({ type: 'openOptionsPage' })}>News Feed Eradicator</button>
		</footer>
	</aside>
}
