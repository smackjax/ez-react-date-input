const path = require('path');
const webpack = require('webpack');
const Uglifyjs = require('uglifyjs-webpack-plugin');
module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve('dist'),
        filename: 'index.js',
        libraryTarget: 'commonjs'
    },
    externals: {
        'react'         : 'commonjs react',
        'prop-types'    : 'prop-types',
        'moment'        : 'moment'
    },
    module:{
        rules: [
            {
                exclude: /(node_modules|bower_components)/,
                test: /\.jsx?$/, 
                loader: 'babel-loader'
            },
            {
                exclude: /(node_modules|bower_components)/,
                test: /.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(en|zh-tw)$/)
    ]
}