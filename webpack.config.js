const webpack = require("webpack");
const path = require("path");
const NgAnnotatePlugin = require('ng-annotate-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
    entry: './src/main/app/delivery.module.js',
    output: {
        path: __dirname + '/build/app/web/include/delivery',
        filename: 'delivery.module.bundle.js'
    },
    plugins: [
        new NgAnnotatePlugin({add: true}),

        new CopyWebpackPlugin([
            {from: './src/main/app/index.html', target: 'web/include/delivery/index.html'},
            {from: './src/main/app/delivery-task-details.html', target: 'web/include/delivery/delivery-task-details.html'},
            {from: './src/main/app/img', to: '../../delivery/img'},
            {from: './node_modules/bootstrap/fonts', to: '../../fonts'}
        ]),

        new BrowserSyncPlugin({
            host: 'localhost',
            port: 3000,
            proxy: 'http://localhost:5516/'
        })
    ],
    module: {
        loaders: [
            {test: /\.js$/, loader: 'babel-loader'}
        ]
    },
    devtool: "#inline-source-map"

}
