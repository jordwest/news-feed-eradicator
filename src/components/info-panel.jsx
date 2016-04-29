var React = require('react');

var PlusOneButton = require( './gplus-one-button.jsx' ),
	FacebookLikeButton = require( './facebook-like-button.jsx' );

import { toggleShowQuotes, hideInfoPanel } from '../store/actions';
import { connect } from 'react-redux';

var InfoPanel = React.createClass({
	render: function() {
		return (
			<div className='nfe-info-panel'>
			<div className='nfe-info-col'>
				<h1>News Feed Eradicator</h1>
				<a href="#"
					title="Close information panel"
					className="nfe-close-button"
					onClick={ this.props.hideInfoPanel }>X</a>

				<hr/>
				<h2>Settings</h2>

				<label>
				<input type="checkbox"
					checked={ this.props.quotesVisible }
					onChange={ this.props.toggleShowQuotes } />
				Show Quotes
				</label>

				<hr/>

				<h2>Share</h2>

				<br/>

				<div>
					<FacebookLikeButton />
				</div>

				<div>
					<PlusOneButton
						size="standard"
						annotation="bubble"
						href="https://chrome.google.com/webstore/detail/news-feed-eradicator-for/fjcldmjmjhkklehbacihaiopjklihlgg" />
				</div>

				<hr/>

				<h2>Contribute</h2>

				<p>
					If you have any ideas for quotes, please submit them to the
					<a href="//www.facebook.com/NewsFeedEradicator"> News Feed Eradicator Facebook page</a>
				</p>
				<p>
					News Feed Eradicator is open source. <a href="https://github.com/jordwest/news-feed-eradicator/">Fork on Github</a>
				</p>
				<hr/>
				<h2>Remove</h2>
				<ul>
					<li>
						<a href="http://news-feed-eradicator.west.io/remove.html">Removal instructions /	Instrucciones de eliminación</a>
					</li>
				</ul>
			</div>
			</div>
		);
	}
});

const mapStateToProps = ( state ) => ( {
	quotesVisible: state.showQuotes,
} );

const mapDispatchToProps = ( dispatch ) => ( {
	toggleShowQuotes: () => dispatch( toggleShowQuotes() ),
	hideInfoPanel: () => dispatch( hideInfoPanel() ),
} );

module.exports = connect( mapStateToProps, mapDispatchToProps )( InfoPanel );
