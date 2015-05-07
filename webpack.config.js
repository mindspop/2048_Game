var path = require('path');
var webpack = require('webpack');

var config = {
	entry: {
		app: [
			'webpack/hot/dev-server',
			path.resolve(__dirname, './app/app.js')
		],

		vender: [
			'jquery',
			'backbone',
			'underscore'
		]
	},

	output: {
		path      : path.resolve(__dirname, 'app/build'),
		filename  : 'bundle-[name].js',
		publicPath: 'assets'
	},

	module: {
		loaders: [
			{test: /\.ejs$/, loader: 'ejs-loader'}
		]
	},

	plugins: [
		new webpack.optimize.CommonsChunkPlugin('vender', 'vender.js'),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin(),
		new webpack.ProvidePlugin({
			_: "underscore"
		})
	]
};

module.exports = config;
