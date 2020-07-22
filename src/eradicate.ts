// Include the stylesheets
import './eradicate.css';

import * as FbClassic from './sites/fb-classic';
import * as Fb2020 from './sites/fb-2020';
import * as LinkedIn from './sites/linkedin';

const matchHost = test => window.location.hostname.includes(test);

if (matchHost('facebook.com')) {
	// Determine which variant we're working with
	if (FbClassic.checkSite()) {
		FbClassic.eradicate();
	} else {
		Fb2020.eradicate();
	}
} else if (matchHost('linkedin.com')) {
	LinkedIn.eradicate();
}
