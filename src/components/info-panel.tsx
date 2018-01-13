import * as React from 'react';

import Settings from './settings';

import { toggleShowQuotes, hideInfoPanel, resetHiddenQuotes } from '../store/actions';
import { connect } from 'react-redux';

const InfoPanel = (props) => {
	return (
		<div className='nfe-info-panel'>
		<div className='nfe-info-col'>
			<h1>News Feed Eradicator</h1>
			<a href="#"
				title="Close information panel"
				className="nfe-close-button"
				onClick={ props.hideInfoPanel }>X</a>

			<hr/>
			<h2>Settings</h2>

			<Settings />

			<hr/>

			<h2>Share</h2>

			<br/>

			<div className="nfe-social-media-icons">
				<a className="nfe-social-media-icon" href="https://www.facebook.com/NewsFeedEradicator/">
					<svg x="0px" y="0px" width="32px" height="32px" viewBox="0 0 32 32" enable-background="new 0 0 32 32">
						<path id="White_2_" fill="#444444" d="M30.7,0H1.3C0.6,0,0,0.6,0,1.3v29.3C0,31.4,0.6,32,1.3,32H17V20h-4v-5h4v-4 c0-4.1,2.6-6.2,6.3-6.2C25.1,4.8,26.6,5,27,5v4.3l-2.6,0c-2,0-2.5,1-2.5,2.4V15h5l-1,5h-4l0.1,12h8.6c0.7,0,1.3-0.6,1.3-1.3V1.3 C32,0.6,31.4,0,30.7,0z"/>
					</svg>
				</a>

				<a className="nfe-social-media-icon" href="https://twitter.com/NewsFeedErad">
					<svg  x="0px" y="0px"
					width="32px" height="32px" viewBox="0 0 32 32" enable-background="new 0 0 32 32">
						<path fill="#444444" d="M32,6.1c-1.2,0.5-2.4,0.9-3.8,1c1.4-0.8,2.4-2.1,2.9-3.6c-1.3,0.8-2.7,1.3-4.2,1.6C25.7,3.8,24,3,22.2,3 c-3.6,0-6.6,2.9-6.6,6.6c0,0.5,0.1,1,0.2,1.5C10.3,10.8,5.5,8.2,2.2,4.2c-0.6,1-0.9,2.1-0.9,3.3c0,2.3,1.2,4.3,2.9,5.5 c-1.1,0-2.1-0.3-3-0.8c0,0,0,0.1,0,0.1c0,3.2,2.3,5.8,5.3,6.4c-0.6,0.1-1.1,0.2-1.7,0.2c-0.4,0-0.8,0-1.2-0.1 c0.8,2.6,3.3,4.5,6.1,4.6c-2.2,1.8-5.1,2.8-8.2,2.8c-0.5,0-1.1,0-1.6-0.1C2.9,27.9,6.4,29,10.1,29c12.1,0,18.7-10,18.7-18.7 c0-0.3,0-0.6,0-0.8C30,8.5,31.1,7.4,32,6.1z"/>
		   		</svg>
			   </a>
			</div>
			<hr/>

			<h2>Contribute</h2>

			<p>
				News Feed Eradicator is open source. <a href="https://github.com/jordwest/news-feed-eradicator/">Fork on Github</a>
			</p>
			<hr/>
			<h2>Remove</h2>
			<ul>
				<li>
					<a href="http://news-feed-eradicator.west.io/remove.html">Removal instructions</a>
				</li>
			</ul>
		</div>
		</div>
	);
};

const mapStateToProps = ( state ) => ( {} );

const mapDispatchToProps = ( dispatch ) => ( {
	hideInfoPanel: () => dispatch( hideInfoPanel() ),
} );

export default connect( mapStateToProps, mapDispatchToProps )( InfoPanel );
