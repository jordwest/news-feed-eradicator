import { createResource, Show, type Accessor } from "solid-js"
import { type RequestQuoteResponse, sendToServiceWorker } from "../messaging/messages"
import type { Theme } from "../storage/schema";
import type { SiteId, WidgetAppearance } from "../types/sitelist";
import { createSignal } from "solid-js";
import { loadHideWidgetToolbar, saveHideWidgetToolbar } from "/storage/storage";

const [quote, { refetch: refetchQuote }] = createResource(async () => {
	return sendToServiceWorker<RequestQuoteResponse>({
		type: 'requestQuote'
	});
})

const setTheme = async (siteId: SiteId, theme: Theme) => {
	await sendToServiceWorker({
		type: 'setSiteTheme',
		siteId,
		theme,
	})
}

export const QuoteWidget = ({ siteId, themePreference, widgetStyle, widgetAppearance }: { siteId: SiteId | null, themePreference: Accessor<Theme | null>, widgetStyle: Accessor<'contained' | 'transparent'>, widgetAppearance: Accessor<WidgetAppearance | undefined> }) => {
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

	const isFacebook = () => widgetAppearance() === 'facebook';
	const containedClasses = () => {
		if (widgetStyle() !== 'contained') return '';
		return isFacebook()
			? 'bg-widget-ground shadow widget-facebook'
			: 'bg-widget-ground b-1 shadow rounded';
	};

	return <aside class="space-y-2">
		<Show when={quote()}>
			<div class={`font-md ${isFacebook() ? 'rounded-lg overflow-hidden' : ''} ${containedClasses()}`}>
				<div class="w-full position-relative">
					<Show when={collapsed()}>
						<div class="p-2 flex w-full axis-end position-absolute lr-0 pointer-events-none">
							<button class="tertiary px-2 pointer-events-all" aria-label="Show News Feed Eradicator toolbar" onClick={() => setCollapsed(false)}>︙</button>
						</div>
					</Show>
					<Show when={!collapsed()}>
						<div class="p-2 bg-darken-100 space-x-4 flex w-full cross-center">
							<Show when={siteId != null}>
								<label for="theme-select" class="text-primary gap-1 flex cross-center font-sm">
									<span>Theme</span>
									<select
										id="theme-select"
										value={themePreference() ?? 'system'}
										onChange={e => setTheme(siteId!, e.currentTarget.value as Theme)}
									>
										<option value="light">Light</option>
										<option value="dark">Dark</option>
										<option value="system">System</option>
									</select>
								</label>
							</Show>
							<div class="flex-1" />
							<button class="primary px-2 font-sm" onClick={() => setCollapsed(true)}>Hide toolbars</button>
						</div>
					</Show>
				</div>
				<div class={`p-4 space-y-2 ${collapsed() ? 'pr-8' : ''}`}>
					<blockquote class="quote-border-left p-2 text-primary">{quote()?.text}</blockquote>
					<figcaption class="text-secondary">{quote()?.author}</figcaption>
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
