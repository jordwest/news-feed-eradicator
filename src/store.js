
var browser = require( 'browser-specific' );

var EventEmitter = require( 'events' ).EventEmitter;

var Immutable = require( 'immutable' );

var defaultSettings = Immutable.Map( {
	showQuotes: true
} );

class Store extends EventEmitter {
	constructor() {
		super();

		this.data = Immutable.Map( {
			settings: defaultSettings
		} );

		this.loadSettings();
	}

	loadSettings( callback ) {
		browser.loadSettings( ( data ) => {
			var settings = this.data.get( 'settings' ).merge( data );
			this.data = this.data.set( 'settings', settings );

			if ( callback ) callback();

			this._notifyChange();
		} );
	}

	saveSettings() {
		browser.saveSettings( this.data.get('settings').toJS() );
	}

	setSetting( settingName, value ) {
		this.data = this.data.setIn( [ 'settings', settingName ], value );

		this._notifyChange();

		this.saveSettings();
	}

	_notifyChange() {
		this.emit( 'change', this.data );
	}

}

module.exports = new Store();
