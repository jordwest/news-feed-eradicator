import * as React from 'react';

import QuoteDisplay from './quote-display';
import InfoPanel from './info-panel';

import { IState } from '../store/reducer';
import { showInfoPanel } from '../store/actions';
import { areNewFeaturesAvailable } from '../store/selectors';
import { connect } from 'react-redux';

interface IProps {
	newFeaturesAvailable: boolean;
	quotesVisible: boolean;
	infoPanelVisible: boolean;

	showInfoPanel: () => void;
}

const NewsFeedEradicator = (props: IProps) => {
	var quoteDisplay = null;
	if ( props.quotesVisible === true ) {
		quoteDisplay = (
			<QuoteDisplay />
		);
	}

	let newFeatureLabel = null;
	if ( props.newFeaturesAvailable ) {
		newFeatureLabel = <span className="nfe-label nfe-new-features">New Features!</span>;
	}

	return (
		<div>
			{ props.infoPanelVisible && <InfoPanel /> }
			{ quoteDisplay }
			<a href="#"
				className="nfe-info-link"
				onClick={ props.showInfoPanel }>News Feed Eradicator { newFeatureLabel }</a>
		</div>
	);
};

const mapStateToProps = ( state ) => ( {
	infoPanelVisible: state.showInfoPanel,
	quotesVisible: state.showQuotes,
	newFeaturesAvailable: areNewFeaturesAvailable( state ),
} );

const mapDispatchToProps = ( dispatch ) => ( {
	showInfoPanel: () => dispatch( showInfoPanel() )
} );

export default connect( mapStateToProps, mapDispatchToProps )( NewsFeedEradicator );
