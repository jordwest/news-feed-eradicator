// Include the stylesheets
import './eradicate.css';

import * as FbClassic from './sites/fb-classic';
import * as Fb2020 from './sites/fb-2020';
import * as Twitter from './sites/twitter';

// Determine which site we're working with
if (Twitter.checkSite()) {
	Twitter.eradicate();
} else if (FbClassic.checkSite()) {
	FbClassic.eradicate();
} else {
	Fb2020.eradicate();
}
