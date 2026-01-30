import { useOptionsPageState } from "../../state";

export const AboutTabContent = () => {
	const state = useOptionsPageState();

	return (
		<div class="p-8 space-y-4">
				<div class="prose">
					<p>I built News Feed Eradicator in a weekend in 2012 just to help defend myself against the addictive Facebook news feed.</p>
					<p>I never expected it to be useful to many others, but thought I'd throw it up online anyway. What I could never have predicted was that the assault on our attention would become as egregious as it has, nor the consequences it would have on society.</p>
					<p>We are now living in the largest for-profit psychological experiment ever conducted on humans and we need tools to defend ourselves.</p>
				</div>

				<div class="prose">
					<h3>How to support this project</h3>
					<p>Thanks! You can help out in a few ways:</p>
					<ul>
						<li>Leave a review on the <a href="https://chrome.google.com/webstore/detail/news-feed-eradicator-for/fjcldmjmjhkklehbacihaiopjklihlgg?hl=en">Chrome web store</a> or <a href="https://addons.mozilla.org/en-US/firefox/addon/news-feed-eradicator/">Firefox store</a></li>
						<li>Tell your friends about the extension</li>
						<li><a href="https://gumroad.com/l/news-feed-eradicator">Buy me a coffee</a></li>
						<li>Contribute bug fixes <a href="https://github.com/jordwest/news-feed-eradicator">on GitHub</a></li>
					</ul>
				</div>

				<div class="prose">
				<h3>I want to suggest a new site</h3>
				<p>Submit or upvote suggestions for new sites on the <a href="https://github.com/jordwest/news-feed-eradicator/discussions/categories/ideas">GitHub discussion board</a>.</p>
				</div>

				<div class="prose">
					<h3>I want to suggest a feature</h3>
					<p>If you have an idea, please submit it (or upvote it if it already exists) on the <a href="https://github.com/jordwest/news-feed-eradicator/discussions/categories/ideas">GitHub Ideas discussion board</a>.</p>
					<p>Generally I rarely add new features as this is a spare time project, I consider it mostly done, and I want to keep it as simple as possible, however I do read and consider all of these.</p>
				</div>

				<div class="prose">
					<h3>A site isn't working or I found a bug</h3>
					<p>Please report bugs <a href="https://github.com/jordwest/news-feed-eradicator/issues">as an issue on GitHub</a></p>
				</div>

				<div class="text-center">
					<button class="font-xs text-secondary" onClick={() => state.page.set('debug')}>Show debug info</button>
				</div>
			</div>
	);
};
