import { createResource, Show } from "solid-js"
import { type RequestQuoteResponse, sendToServiceWorker } from "../../messaging/messages"

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

export const QuoteWidget = () => {
	return <div class="p-4 space-y-2">
		<Show when={quote()}>
			<button onClick={nextQuote}>&gt;</button>
			<button onClick={disableQuote}>Disable this quote</button>
			<div class="quote-border-left p-2">{quote()?.text}</div>
			<div class="text-secondary">{quote()?.source}</div>
		</Show>
	</div>
}
