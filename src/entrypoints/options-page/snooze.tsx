import { createMemo, createSignal, Show } from "solid-js";
import { displayDuration } from "../../lib/util";
import { useOptionsPageState } from "./state";

type SnoozePendingInfo = {
	secondsEarned: number;
	pendingProgress: number;
}

export const Snooze = () => {
	const state = useOptionsPageState();

	const [buttonHeldSince, setButtonHeldSince] = createSignal<number | null>(null);

	const timeHeld = createMemo(() => {
		const since = buttonHeldSince();
		if (since == null) return null;

		return (state.clock.get() - since) / 1000;
	});

	const snoozePendingInfo = createMemo((): SnoozePendingInfo | null => {
		const holdTime = timeHeld();
		if (holdTime == null) return null;

		if (holdTime < 5) {
			return { secondsEarned: 0, pendingProgress: holdTime / 5 };
		}

		if (holdTime < 60) {
			return { secondsEarned: 30 + Math.round((holdTime - 5) * 5), pendingProgress: 1 };
		}

		return { secondsEarned: 30 + (55 * 5) + Math.round((holdTime - 60) * 20), pendingProgress: 1 };
	});

	const buttonDown = () => {
		setButtonHeldSince(state.clock.get());
	};

	const buttonUp = async () => {
		const { secondsEarned } = snoozePendingInfo() ?? {};
		if (secondsEarned != null && secondsEarned > 0) {
			await state.startSnooze(1000 * secondsEarned);
		}
		setButtonHeldSince(null);
	};

	const isSnoozing = () => {
		const snoozeState = state.snoozeState.get();
		return snoozeState != null && snoozeState > state.clock.get();
	}

	const snoozeProgress = () => {

	}

	const snoozeButtonLabel = () => {
		const { secondsEarned } = snoozePendingInfo() ?? {};
		if (secondsEarned == null) return 'Press and hold to snooze';
		if (secondsEarned === 0) return 'Keep holding...';

		return `Snooze for ${displayDuration(secondsEarned)}`;
	}

	const snoozeButtonTransform = () => {
		const { pendingProgress } = snoozePendingInfo() ?? {};
		if (pendingProgress == null) return 'scaleX(0)';
		return `scaleX(${pendingProgress})`;
	}

	return <div>
		<Show when={!isSnoozing()}>
			<div class="flex axis-center">
				<button class="primary font-lg p-8 overlay-container isolate" style="width: 300px" onMouseDown={buttonDown} onMouseUp={buttonUp} onMouseLeave={buttonUp}>
					<div class="z1 overlay bg-accent transform-origin-left" style={`transform: ${snoozeButtonTransform()}`} />
					<div class="z2 position-relative">
						{snoozeButtonLabel()}
					</div>
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
