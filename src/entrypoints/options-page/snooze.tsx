import { createMemo, createSignal, Show, type ParentComponent } from "solid-js";
import { displayDuration } from "../../lib/time";
import { useOptionsPageState } from "./state";
import { DAY, HOUR, MINUTE } from "/lib/time";

type SnoozePendingInfo = {
	secondsEarned: number;
	pendingProgress: number;
}

export const HoldSnoozeButton = () => {
	const state = useOptionsPageState();

	const [buttonHeldSince, setButtonHeldSince] = createSignal<number | null>(null);
	const disabled = () => state.selectedSiteId.get() == null;

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

	const buttonDown = (e: { button: number, preventDefault: () => void }) => {
		if (e.button !== 0) return;
		setButtonHeldSince(state.clock.get());
	};

	const buttonUp = async (e: { button: number }) => {
		if (e.button !== 0) return;
		const { secondsEarned } = snoozePendingInfo() ?? {};
		if (secondsEarned != null && secondsEarned > 0) {
			await state.startSnooze(1000 * secondsEarned);
		}
		setButtonHeldSince(null);
	};

	const snoozeButtonLabel = () => {
		const { secondsEarned } = snoozePendingInfo() ?? {};
		if (secondsEarned == null) return 'Press and hold to snooze';
		if (secondsEarned === 0) return 'Keep holding...';

		return `Snooze for ${displayDuration(secondsEarned * 1000)}`;
	}

	const snoozeButtonTransform = () => {
		const { pendingProgress } = snoozePendingInfo() ?? {};
		if (pendingProgress == null) return 'scaleX(0)';
		return `scaleX(${pendingProgress})`;
	}

	return <button disabled={disabled()} class="primary font-lg p-8 overlay-container isolate" style="width: 300px" onMouseDown={buttonDown} onMouseUp={buttonUp} onContextMenu={e => e.preventDefault()} onMouseLeave={buttonUp}>
		<div class="z1 overlay bg-accent transform-origin-left" style={`transform: ${snoozeButtonTransform()}`} />
		<div class="z2 position-relative">
			{snoozeButtonLabel()}
		</div>
	</button>
}

const InstantSnoozeButton: ParentComponent<{ ms: number, primary?: boolean }> = ({ms, primary, children}) => {
	const state = useOptionsPageState();
	const disabled = () => state.selectedSiteId.get() == null;

	const onClick = async () => {
		await state.startSnooze(ms);
	}

	return <button disabled={disabled()} class={`${primary ? 'primary' : 'tertiary'} font-lg p-4`} onClick={onClick}>{children}</button>
}

const InstantSnoozeButtons = () => {
		return <div class="flex gap-2 cross-center card outlined shadow p-4">
			<div class="text-secondary">Snooze for</div>
			<InstantSnoozeButton ms={MINUTE}>1m</InstantSnoozeButton>
			<InstantSnoozeButton ms={2 * MINUTE}>2m</InstantSnoozeButton>
			<InstantSnoozeButton ms={5 * MINUTE}>5m</InstantSnoozeButton>
			<InstantSnoozeButton primary ms={10 * MINUTE}>10m</InstantSnoozeButton>
			<InstantSnoozeButton ms={30 * MINUTE}>30m</InstantSnoozeButton>
			<InstantSnoozeButton ms={HOUR}>1h</InstantSnoozeButton>
			<InstantSnoozeButton ms={DAY}>24h</InstantSnoozeButton>
		</div>
}

export const Snooze = () => {
	const state = useOptionsPageState();

	const selectedSite = createMemo(() => {
		const siteId = state.selectedSiteId.get();
		if (siteId == null) return null;
		return state.siteList.get()?.sites.find(s => s.id === siteId) ?? null;
	});

	const selectedSiteLabel = () => selectedSite()?.title ?? state.selectedSiteId.get();

	const isSnoozing = () => {
		const snoozeState = state.snoozeState.get();
		return snoozeState != null && snoozeState > state.clock.get();
	}

	return <div>
		<Show when={state.selectedSiteId.get() == null}>
			<div class="flex cross-center p-4 card outlined shadow">
				<div class="flex-1 text-secondary">
					Snooze applies to the site selected in the Sites tab.
				</div>
				<button class="secondary" onClick={() => state.page.set('sites')}>
					Select a site
				</button>
			</div>
		</Show>

		<Show when={state.selectedSiteId.get() != null}>
			<div class="text-secondary font-sm p-2 text-center">
				Snooze applies to: {selectedSiteLabel()}
			</div>

			<Show when={!isSnoozing()}>
				<div class="flex axis-center">
					<Show when={state.snoozeMode.get() === 'hold'}>
						<HoldSnoozeButton />
					</Show>
					<Show when={state.snoozeMode.get() === 'instant'}>
						<InstantSnoozeButtons />
					</Show>
				</div>
			</Show>

			<Show when={isSnoozing()}>
				<div class="flex cross-center p-4 card secondary outlined shadow">
					<div class="flex-1">
						💤 Snoozing {selectedSiteLabel()} for {displayDuration((state.snoozeState.get()! - state.clock.get()))}. Scroll your life away!
					</div>
					<button class="secondary" onClick={() => state.cancelSnooze()}>
						Cancel snooze
					</button>
				</div>
			</Show>
		</Show>
	</div>
}
