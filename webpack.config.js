module.exports = {
	context: __dirname + '/src',
	entry: {
		'chrome': './eradicate.js'
	},
	output: {
		path: __dirname + '/dist',
		filename: '[name]/eradicate.js'
	},
	module: {
		loaders: [
		]
	}
};
