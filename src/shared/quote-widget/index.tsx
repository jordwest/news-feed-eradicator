import { createResource } from "solid-js"
import { getBrowser } from "../../lib/webextension"
import { type RequestQuoteResponse, sendToServiceWorker } from "../../messaging/messages"

const [quote] = createResource(async () => {
	return sendToServiceWorker<RequestQuoteResponse>({
		type: 'requestQuote'
	});
})

export const QuoteWidget = () => {
	return <div class="p-4 space-y-2">
		<div class="quote-border-left p-2">{quote()?.text}</div>
		<div class="text-secondary">{quote()?.source}</div>
	</div>
}
