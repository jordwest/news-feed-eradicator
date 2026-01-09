import { Show } from "solid-js";
import { useOptionsPageState } from "./state"

export const LockedSettingsOverlay = () => {
	const state = useOptionsPageState();

	return <Show when={state.settingsLockedDown()}>
		<div class="overlay flex cross-center axis-center">
			<div class="card shadow rounded p-4 text-center flex flex-col gap-2">
				<h3 class="font-xl">
					🔒 Settings locked down
				</h3>
				<p class="text-secondary">
					To unlock, start snoozing then click the button below
				</p>
			</div>
		</div>
	</Show>
}

export const SettingsLockFooter	= () => {
	const state = useOptionsPageState();

	return <div class="p-2 bg-darken-100 flex gap-4 cross-center axis-end">
		<Show when={!state.settingsLockedDown()}>
			<label class="text-secondary font-xs">Finished setting everything up? Lock it in.</label>
			<button class="primary font-sm" onClick={() => state.setSettingsLocked(true)}>Lock settings</button>
		</Show>
		<Show when={state.settingsLockedDown()}>
			<button class="secondary font-sm" disabled={!state.canUnlockSettings()} onClick={() => state.setSettingsLocked(false)}>
				Unlock settings
			</button>
		</Show>
	</div>
}
