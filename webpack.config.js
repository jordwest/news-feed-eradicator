
var webpack = require( 'webpack' );
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var browser = 'chrome';
var env = process.env.NODE_ENV || 'dev';
if(process.env.BROWSER) {
	browser = process.env.BROWSER;
	console.log('Building', browser, 'extension');
}else{
	console.log('Defaulting to', browser, 'build. To specify browser, '+
		'use the BROWSER env var, eg', 'BROWSER=firefox');
}

var eradicateJS = 'eradicate.js';
var eradicateCSS = 'eradicate.css';
var reactExternal = false;

// Firefox expects included scripts to be under the 'data' directory
if(browser === 'firefox') {
	eradicateJS = 'data/' + eradicateJS;
	eradicateCSS = 'data/' + eradicateCSS;
	reactExternal = 'React';
}

module.exports = {
	context: __dirname + '/src',
	entry: './eradicate.js',
	resolve: {
		alias: {
			'browser-specific': __dirname + '/browsers/' + browser + '.js'
		},
		extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.ts', '.tsx']
	},
	output: {
		path: __dirname + '/build/' + browser,
		filename: eradicateJS
	},
	externals: [
		{
			'sdk/simple-storage': 'require( "sdk/simple-storage" )',
			'react': reactExternal
		}
	],
	module: {
		loaders: [
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract("style-loader", "css-loader")
			},
			{
				test: /\.jsx?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel',
				query: {
					presets: [ 'react', 'es2015' ],
				}
			},
			{
				test: /\.tsx?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader!ts-loader',
			}
		]
	},
	// Use the plugin to specify the resulting filename (and add needed behavior to the compiler)
	plugins: [
		new ExtractTextPlugin(eradicateCSS),
		new webpack.DefinePlugin({
			'process.env': { NODE_ENV: JSON.stringify( env ) }
		})
	]
};
