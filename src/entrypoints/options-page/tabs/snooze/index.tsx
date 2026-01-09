import type { ParentComponent } from "solid-js";
import type { SnoozeMode } from "/storage/schema";
import { useOptionsPageState } from "../../state";
import { saveSnoozeMode } from "/storage/storage";

const SnoozeModeOption: ParentComponent<{ mode: SnoozeMode, title: string }> = ({ mode, title, children }) => {
	const state = useOptionsPageState();

	const onClick = async () => {
		await saveSnoozeMode(mode);
		state.snoozeMode.refetch();
	}

	return <li class="bg-darken-100 rounded">
		<label class="hoverable block p-4 space-y-2 cursor-pointer">
			<div class="flex gap-1">
				<input type="radio" class="radio" name="snooze-mode" checked={state.snoozeMode.get() === mode} onClick={onClick} />
				<div class="space-y-1">
					<span class="flex-1">{ title }</span>
					<div class="text-secondary font-sm ml-4">
						{ children }
					</div>
				</div>
			</div>
		</label>
	</li>
}

export const SnoozeTabContent = () => {
	return (
		<div class="p-4 space-y-4">
			<ul class="space-y-1">
				<SnoozeModeOption mode="hold" title="Hold to snooze">
					Requires you to hold the snooze button down for a while to start snoozing. The longer you hold, the longer the snooze.
				</SnoozeModeOption>

				<SnoozeModeOption mode="instant" title="Instant snooze">
					Not worried about your self-control? With this option you can just hit a button to start snoozing instantly.
				</SnoozeModeOption>
			</ul>
		</div>
	);
};
