/**
 * Created by Anly.Z on 16/7/19.
 */
'use strict';

var path = require('path');
var webpack = require('webpack');
var jquery = require('jquery');


module.exports = {
	devtool: 'source-map',
	entry: [
		'webpack-hot-middleware/client?path=/__webpack_hmr&reload=true',
		'./src/app/app.js'
	],

	output:{
		path: path.join(__dirname,'src/dist/webpack'),
		filename:'bundle.js'
	},
	module:{
		loaders:[
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				loaders: ['babel'],
				include: path.join(__dirname, 'src')
				//query: {
				//	presets: ['es2015']
				//}
			},
			{
				test: /\.css$/,
				exclude: /(node_modules|bower_components)/,
				loaders: ['style', 'css']
			},
			{
				test: /\.html/,
				exclude: /(node_modules|bower_components)/,
				loader: 'html'
			},
			{
				test: /\.(png|jpg|git|svg)$/,
				loader: 'url-loader'
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'file-loader'
			}

		]
	},
	plugins: [
		new webpack.ProvidePlugin({
			"$": 'jquery',
			"jQuery": 'jquery',
			"window.jQuery": 'jquery'
		}),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin()
	],

	resolve: {
		extensions: ['', '.js']
	}

};