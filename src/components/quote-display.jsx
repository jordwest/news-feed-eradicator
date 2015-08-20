var React = require('react');

var QuoteDisplay = React.createClass({
	render: function() {
		return (
			<div className='nfe-quote'>
				<p className='nfe-quote-text'>“{ this.props.text }”</p>
				<p className='nfe-quote-source'>~ { this.props.source }</p>
			</div>
		);
	}
});

module.exports = QuoteDisplay;
