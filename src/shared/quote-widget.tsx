import { createResource, Show, type Accessor } from "solid-js"
import { type RequestQuoteResponse, sendToServiceWorker } from "../messaging/messages"
import type { Theme } from "../storage/schema";
import type { SiteId } from "../types/sitelist";
import { createSignal } from "solid-js";
import { getBrowser } from "/lib/webextension";
import { loadHideWidgetToolbar, saveHideWidgetToolbar } from "/storage/storage";

const [quote, { refetch: refetchQuote }] = createResource(async () => {
	return sendToServiceWorker<RequestQuoteResponse>({
		type: 'requestQuote'
	});
})

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

	// Quote must be enabled if it appears in here
	const [enabled, setEnabled] = createSignal(true);

	const nextQuote = async () => {
		await refetchQuote();
		setEnabled(true);
	}

	loadHideWidgetToolbar().then(hidden => setCollapsedLocal(hidden));

	const setCollapsed = (collapsed: boolean) => {
			saveHideWidgetToolbar(collapsed);
			setCollapsedLocal(collapsed);
	}

	const setQuoteEnabled = async (enabled: boolean) => {
			const q = quote();
			if (q == null) return;

			setEnabled(enabled);

			await sendToServiceWorker({
				type: 'setQuoteEnabled',
				quoteListId: q.quoteListId,
				id: q.id,
				enabled,
			});
	}

	const openOptionsPage = () => sendToServiceWorker({ type: 'openOptionsPage' })

	return <aside class="space-y-2">
		<Show when={quote()}>
		<div class="bg-widget-ground b-1 shadow rounded font-md">
				<div class="w-full position-relative">
					<Show when={collapsed()}>
						<div class="p-2 flex w-full axis-end position-absolute lr-0 pointer-events-none">
							<button class="tertiary px-2 pointer-events-all" aria-label="Show News Feed Eradicator toolbar" onClick={() => setCollapsed(false)}>︙</button>
						</div>
					</Show>
					<Show when={!collapsed()}>
						<div class="p-2 bg-darken-100 space-x-4 flex w-full cross-center">
							<Show when={siteId != null}>
								<label for="theme-toggle" class="cursor-pointer text-primary gap-1 flex cross-center">
									<span aria-label="Light mode">☀️</span>
									<input id="theme-toggle" type="checkbox" checked={theme() === 'dark'} class="toggle" onInput={e => toggleTheme(e, siteId!, theme() ?? 'light')} />
									<span aria-label="Dark mode">🌙</span>
								</label>
							</Show>
							<div class="flex-1" />
							<button class="primary px-2 font-sm" onClick={() => setCollapsed(true)}>Hide toolbars</button>
						</div>
					</Show>
				</div>
				<div class={`p-4 space-y-2 font-lg ${collapsed() ? 'pr-8' : ''}`}>
					<div class="quote-border-left p-2 text-primary">{quote()?.text}</div>
					<div class="text-secondary">{quote()?.author}</div>
				</div>
				<Show when={!collapsed()}>
					<div class="p-2 bg-darken-100 shadow space-x-4 flex w-full">
						<div class="space-x-2 flex-1 flex">
							<button class="tertiary text-primary font-sm" onClick={nextQuote}>Next quote &gt;</button>
							<label for="quote-toggle" class="cursor-pointer hoverable flex cross-center p-2 text-secondary rounded font-sm gap-1">
								<input id="quote-toggle" type="checkbox" class="checkbox" checked={enabled()} onChange={e => setQuoteEnabled(e.currentTarget.checked)} />
								<span>Show this quote in future</span>
							</label>
							<div class="flex-1" />
							<button class="tertiary font-sm" onClick={openOptionsPage}>More options...</button>
						</div>
					</div>
				</Show>
		</div>
		</Show>
		<footer class="flex axis-center">
				<button class="font-xs tertiary bg-transparent text-subtle text-shadow" onClick={openOptionsPage}>News Feed Eradicator</button>
		</footer>
	</aside>
}
