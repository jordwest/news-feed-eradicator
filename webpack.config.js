
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var browser = 'chrome';
var browserSpecific = __dirname + '/browsers/' + browser + '.js';
var outputPath = __dirname + '/dist/' + browser;

module.exports = {
	context: __dirname + '/src',
	entry: './eradicate.js',
	resolve: {
		alias: {
			'browser-specific': browserSpecific
		}
	},
	output: {
		path: outputPath,
		filename: 'eradicate.js'
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
		new ExtractTextPlugin("eradicate.css")
	]
};
