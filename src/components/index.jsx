var React = require( 'react' );

var QuoteList = require( '../quotes.js' )

var QuoteDisplay = require( './quote-display.jsx' ),
	InfoPanel = require( './info-panel.jsx' );

var Store = require( '../store.js' );

var NewsFeedEradicator = React.createClass( {
	getInitialState: function() {
		var selectedQuote = QuoteList[ Math.floor( Math.random() * QuoteList.length ) ];

		return {
			quote: selectedQuote,
			infoPanelVisible: false,
			data: Store.data
		};
	},

	componentDidMount: function() {
		Store.on( 'change', this.dataChanged );
	},

	componentWillUnmount: function() {
		Store.removeListener( 'change', this.dataChanged );
	},

	dataChanged: function( newData ) {
		this.setState( {
			data: newData
		} );
	},

	onClickLogo: function( e ) {
		e.preventDefault();
		this.setState({
			infoPanelVisible: true
		});
	},

	onCloseInfoPanel: function( e ) {
		e.preventDefault();
		this.setState( {
			infoPanelVisible: false
		} );
	},

	render: function() {
		var infoPanel = null;
		if ( this.state.infoPanelVisible === true ) {
			infoPanel = (
				<InfoPanel
					settings={ this.state.data.get( 'settings' ) }
					onClose={ this.onCloseInfoPanel } />
			);
		}

		var quoteDisplay = null;
		if ( this.state.data.get( 'settings' ).get( 'showQuotes' ) === true ) {
			quoteDisplay = (
				<QuoteDisplay
					text={ this.state.quote.quote }
					source={ this.state.quote.source } />
			);
		}

		return (
			<div>
				{ infoPanel }
				{ quoteDisplay }
				<a href="#"
					className="nfe-info-link"
					onClick={ this.onClickLogo }>News Feed Eradicator :)</a>
			</div>
		);
	}
} );

module.exports = NewsFeedEradicator;
