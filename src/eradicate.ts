// Include the stylesheets
import './eradicate.css';

import * as FbClassic from './sites/fb-classic';
import * as Fb2020 from './sites/fb-2020';

// Determine which variant we're working with

if (FbClassic.checkSite()) {
	FbClassic.eradicate();
} else {
	Fb2020.eradicate();
}

