var ExtractTextPlugin = require("extract-text-webpack-plugin");

var browser = 'chrome';
if(process.env.BROWSER) {
	browser = process.env.BROWSER;
	console.log('Building', browser, 'extension');
}else{
	console.log('Defaulting to', browser, 'build. To specify browser, '+
		'use the BROWSER env var, eg', 'BROWSER=firefox');
}

var eradicateJS = 'eradicate.js';
var eradicateCSS = 'eradicate.css';

// Firefox expects included scripts to be under the 'data' directory
if(browser === 'firefox') {
	eradicateJS = 'data/' + eradicateJS;
	eradicateCSS = 'data/' + eradicateCSS;
}

module.exports = {
	context: __dirname + '/src',
	entry: './eradicate.js',
	resolve: {
		alias: {
			'browser-specific': __dirname + '/browsers/' + browser + '.js'
		}
	},
	output: {
		path: __dirname + '/build/' + browser,
		filename: eradicateJS
	},
	module: {
		loaders: [
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract("style-loader", "css-loader")
			}
		]
	},
	// Use the plugin to specify the resulting filename (and add needed behavior to the compiler)
	plugins: [
		new ExtractTextPlugin(eradicateCSS)
	]
};
