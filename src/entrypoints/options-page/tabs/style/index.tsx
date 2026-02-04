import { useOptionsPageState } from "../../state";
import { Toggle } from "/shared/components/toggle";

export const StyleTabContent = () => {
	const state = useOptionsPageState();

	return (
		<div>
			<Toggle checked={() => state.storage.widgetStyle.get() === 'transparent'} setChecked={checked => state.storage.setWidgetStyle(checked ? 'transparent' : 'contained')}>
				<div class="space-y-1">
					<div>
						Transparent quote widget background
					</div>
					<div class="text-secondary font-xs">
						Be aware this may affect the readability of the text if the widget dark/light mode setting does not match the site.
					</div>
				</div>
			</Toggle>
			<Toggle checked={() => state.storage.regionHideStyle.get() === 'blur'} setChecked={checked => state.storage.setRegionHideStyle(checked ? 'blur' : 'hidden')}>
				<div class="space-y-1">
					<div>
						Display hidden regions as blurred
					</div>
					<div class="text-secondary font-xs">
						If disabled, hidden regions will be completely invisible.
					</div>
				</div>
			</Toggle>
		</div>
	);
};
