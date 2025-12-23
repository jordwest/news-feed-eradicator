import { createMemo, createResource, createSignal, Show } from "solid-js";
import { getBrowser } from "../../lib/webextension";
import { displayDuration } from "../../lib/util";

const browser = getBrowser();

const [snoozeState, { refetch: refreshSnoozeState }] = createResource<number | null>(async () => {
	return browser.runtime.sendMessage({
		type: 'readSnooze',
	})
});

export const Snooze = () => {
	const [now, setNow] = createSignal(Date.now());
	const [buttonHeldSince, setButtonHeldSince] = createSignal<number | null>(null);

	const timeHeld = createMemo(() => {
		const since = buttonHeldSince();
		if (since == null) return null;

		return Math.round((now() - since) / 100) / 10;
	});

	const snoozeTime = createMemo(() => {
		const holdTime = timeHeld();
		if (holdTime == null) return null;

		if (holdTime < 5) {
			return 0;
		}

		if (holdTime < 60) {
			return 30 + Math.round((holdTime - 5) * 5);
		}

		return 30 + (55 * 5) + Math.round((holdTime - 60) * 20);
	});

	setInterval(() => {
		setNow(Date.now());
	}, 100)

	const buttonDown = () => {
		setButtonHeldSince(now());
	};

	const buttonUp = async () => {
		const duration = snoozeTime();
		if (duration != null && duration > 0) {
			await browser.runtime.sendMessage({
				type: 'snooze',
				until: Date.now() + 1000 * duration,
			})
			refreshSnoozeState();
		}
		setButtonHeldSince(null);
	};

	const cancelSnooze = async () => {
		await browser.runtime.sendMessage({
			type: 'snooze',
			until: Date.now(),
		})
		refreshSnoozeState();
	};

	const isSnoozing = () => {
		const state = snoozeState();
		return state != null && state > now();
	}

	return <div class="text-center">
		<div>{snoozeState() == null || snoozeState()! <= now() ? 'Hold button below to snooze' : `Snoozing for ${displayDuration((snoozeState()! - now()) / 1000)}`}</div>

		<Show when={!isSnoozing()}>
			<button class="font-lg p-8" onMouseDown={buttonDown} onMouseUp={buttonUp} onMouseLeave={buttonUp}>
				{snoozeTime() == null ? 'Hold to Snooze' : `Snooze for ${displayDuration(snoozeTime()!)}s` }
			</button>
		</Show>
		<Show when={isSnoozing()}>
			<button class="font-lg" onClick={cancelSnooze}>
				Cancel snooze
			</button>
		</Show>
	</div>
}
