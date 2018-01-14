
export function loadSettings( callback ) {
	chrome.storage.sync.get( null, ( data ) => {
		callback( data );
	} );
};

export function saveSettings( data ) {
	chrome.storage.sync.set( data );
};
