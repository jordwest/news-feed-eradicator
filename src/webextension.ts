
// Include main chrome manifest
require( 'file-loader?name=manifest.json!./manifest.json' );

// Chrome requires extension icons
require( 'file-loader?name=icon16.jpg!../assets/icon16.jpg' );
require( 'file-loader?name=icon48.jpg!../assets/icon48.jpg' );
require( 'file-loader?name=icon128.jpg!../assets/icon128.jpg' );

export function loadSettings( callback ) {
	chrome.storage.sync.get( null, ( data ) => {
		callback( data );
	} );
};

export function saveSettings( data ) {
	chrome.storage.sync.set( data );
};
