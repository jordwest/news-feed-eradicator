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
import * as LinkedIn from './sites/linkedin';
import { createStore, Store } from './store';

const store = createStore();

export function eradicate(store: Store) {
	// Determine which site we're working with
	if (Reddit.checkSite()) {
		Reddit.eradicate(store);
	} else if (Twitter.checkSite()) {
		Twitter.eradicate(store);
	} else if (FbClassic.checkSite()) {
		FbClassic.eradicate(store);
	} else if (HackerNews.checkSite()) {
		HackerNews.eradicate(store);
	} else if (LinkedIn.checkSite()) {
		LinkedIn.eradicate(store);
	} else  {
		Fb2020.eradicate(store);
  }
}

setupRouteChange(store);
eradicate(store);
