import { createMemo, createSignal, Show } from "solid-js";
import { displayDuration } from "../../lib/util";
import { useOptionsPageState } from "./state";

export const Snooze = () => {
	const state = useOptionsPageState();

	const [buttonHeldSince, setButtonHeldSince] = createSignal<number | null>(null);

	const timeHeld = createMemo(() => {
		const since = buttonHeldSince();
		if (since == null) return null;

		return Math.round((state.clock.get() - since) / 100) / 10;
	});

	const snoozeSecondsPending = createMemo(() => {
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

	const buttonDown = () => {
		setButtonHeldSince(state.clock.get());
	};

	const buttonUp = async () => {
		const seconds = snoozeSecondsPending();
		if (seconds != null && seconds > 0) {
			await state.startSnooze(1000 * seconds);
		}
		setButtonHeldSince(null);
	};

	const isSnoozing = () => {
		const snoozeState = state.snoozeState.get();
		return snoozeState != null && snoozeState > state.clock.get();
	}

	return <div>
		<Show when={!isSnoozing()}>
			<div class="flex axis-center">
				<button class="primary font-lg p-8" onMouseDown={buttonDown} onMouseUp={buttonUp} onMouseLeave={buttonUp}>
					{snoozeSecondsPending() == null ? 'Hold to Snooze' : `Snooze for ${displayDuration(snoozeSecondsPending()!)}` }
				</button>
			</div>
		</Show>
		<Show when={isSnoozing()}>
			<div class="flex cross-center p-4 card secondary outlined shadow">
				<div class="flex-1">
					💤 Snoozing for {displayDuration((state.snoozeState.get()! - state.clock.get()) / 1000)}. Scroll your life away!
				</div>
				<button class="secondary" onClick={() => state.cancelSnooze()}>
					Cancel snooze
				</button>
			</div>
		</Show>
	</div>
}
