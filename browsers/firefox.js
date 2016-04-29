
var ss = require("sdk/simple-storage");

// Include package.json
require( 'file?name=package.json!./firefox/package.json' );

require( 'file?name=index.js!./firefox/index.js' );

require( 'file?name=icon48.jpg!../assets/icon48.jpg' );

module.exports = {
	loadSettings: function( callback ) {
		callback( ss.storage );
	},

	saveSettings: function( data ) {
		ss.storage = data;
	}
};
