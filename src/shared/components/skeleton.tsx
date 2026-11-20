import type { Component } from "solid-js";

export const Skeleton: Component<{width?: string, height?: string}> = (props) => {
	return (
		<div class="loading-skeleton" style={{ "min-width": props.width, "min-height": props.height }}>
		</div>
	);
}
