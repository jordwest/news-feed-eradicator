/**
 * This script should run at document start to set up
 * intercepts before the site loads.
 */

import './eradicate.css';
import { setupRouteChange } from './lib/route-change';

import * as FbClassic from './sites/fb-classic';
import * as Fb2020 from './sites/fb-2020';
import * as Twitter from './sites/twitter';
import * as Reddit from './sites/reddit';
import * as HackerNews from './sites/hackernews';
import * as Github from './sites/github';
import * as LinkedIn from './sites/linkedin';
import * as Instagram from './sites/instagram';
import * as YouTube from './sites/youtube';
import * as Odysee from './sites/odysee';
import { createStore, Store } from './store';

const store = createStore();

export function eradicate(store: Store) {
	// Determine which site we're working with
	switch (true) {
		case Odysee.checkSite():
			Odysee.eradicate(store);
			break;
		case Reddit.checkSite():
			Reddit.eradicate(store);
			break;
		case Twitter.checkSite():
			Twitter.eradicate(store);
			break;
		case HackerNews.checkSite():
			HackerNews.eradicate(store);
			break;
		case Github.checkSite():
			Github.eradicate(store);
			break;
		case LinkedIn.checkSite():
			LinkedIn.eradicate(store);
			break;
		case YouTube.checkSite():
			YouTube.eradicate(store);
			break;
		case Instagram.checkSite():
			Instagram.eradicate(store);
			break;
		case FbClassic.checkSite():
			FbClassic.eradicate(store);
			break;
		default:
			Fb2020.eradicate(store);
			break;
	}
}

setupRouteChange(store);
eradicate(store);
