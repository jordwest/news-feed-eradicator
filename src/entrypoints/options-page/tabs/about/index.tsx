import type { ParentComponent } from "solid-js";

export const AboutTabContent = () => {
	return (
		<div class="p-4 space-y-2">
			<p>Thanks for trying out the beta!</p>
			<p>This page coming soon.</p>
			<p>Check <a href="https://github.com/jordwest/news-feed-eradicator/discussions/categories/announcements">announcements</a> for more info.</p>
			<div class="divide-y b-1">
				<ExpandingRegion title="Section 1">
					<p>Hello I'm a paragraph</p>
				</ExpandingRegion>
				<ExpandingRegion title="Section 2">
					<p>Hello I'm a paragraph</p>
				</ExpandingRegion>
			</div>
		</div>
	);
};

const ExpandingRegion: ParentComponent<{title: string}> = ({ title, children }) => {
	return <details class="">
		<summary class="hoverable cursor-pointer block p-4 flex gap-2"><div class="open-rotate"></div> {title}</summary>
		<div class="p-4">{children}</div>
	</details>
}
