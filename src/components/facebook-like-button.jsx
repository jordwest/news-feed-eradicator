var React = require('react');

// Inserts a Facebook like button
var FacebookLikeButton = React.createClass({
	render: function() {
		var iframeStyle = {
			border: 'none',
			overflow: 'hidden',
			width: '220px',
			height: '62px'
		};

		return (
			<iframe src="//www.facebook.com/plugins/likebox.php?href=https%3A%2F%2Fwww.facebook.com%2FNewsFeedEradicator&amp;width=220&amp;height=62&amp;colorscheme=light&amp;show_faces=false&amp;header=true&amp;stream=false&amp;show_border=true&amp" scrolling="no" frameBorder="0" style={ iframeStyle } allowTransparency="true"></iframe>
		);
	}
});

module.exports = FacebookLikeButton;
