// Include the stylesheets
import './eradicate.css';

import * as FbClassic from './sites/fb-classic';

// Determine which variant we're working with

if (FbClassic.checkSite()) {
	FbClassic.eradicate();
} else {
	console.log('Something else?');
}

