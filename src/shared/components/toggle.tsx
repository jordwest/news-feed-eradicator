import type { Accessor, ParentComponent, Setter } from "solid-js"

export const Toggle: ParentComponent<{checked: Accessor<boolean>, setChecked: Setter<boolean>}> = ({checked, setChecked, children}) => {
	return <label class="flex cross-center cursor-pointer p-4 hoverable">
		<input type="checkbox" class="toggle" checked={checked()} onChange={() => setChecked(!checked())} />
		<span class="px-2 py-1">{children}</span>
	</label>
}
