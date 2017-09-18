var React = require( 'react' );

var QuoteDisplay = require( './quote-display.tsx' ).default,
	InfoPanel = require( './info-panel.jsx' );

import { IState } from '../store/reducer';
import { showInfoPanel } from '../store/actions';
import { areNewFeaturesAvailable } from '../store/selectors';
import { connect } from 'react-redux';

var NewsFeedEradicator = React.createClass( {
	render: function() {
		var quoteDisplay = null;
		if ( this.props.quotesVisible === true ) {
			quoteDisplay = (
				<QuoteDisplay />
			);
		}

		let newFeatureLabel = null;
		if ( this.props.newFeaturesAvailable ) {
			newFeatureLabel = <span className="nfe-label nfe-new-features">New Features!</span>;
		}

		return (
			<div>
				{ this.props.infoPanelVisible && <InfoPanel /> }
				{ quoteDisplay }
				<a href="#"
					className="nfe-info-link"
					onClick={ this.props.showInfoPanel }>News Feed Eradicator { newFeatureLabel } <em>votes YES 🏳️‍🌈</em></a>
			</div>
		);
	}
} );

const mapStateToProps = ( state ) => ( {
	infoPanelVisible: state.showInfoPanel,
	quotesVisible: state.showQuotes,
	newFeaturesAvailable: areNewFeaturesAvailable( state ),
} );

const mapDispatchToProps = ( dispatch ) => ( {
	showInfoPanel: () => dispatch( showInfoPanel() )
} );

module.exports = connect( mapStateToProps, mapDispatchToProps )( NewsFeedEradicator );
