var webpack = require("webpack");
var path = require("path");
var NgAnnotatePlugin = require('ng-annotate-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJS = require("uglify-js");
const minify = (content) => UglifyJS.minify(String(content), {mangle: false}).code;

module.exports = {
    entry: ['./src/main/app/delivery.module.js'],
    output: {
        path: __dirname + '/build/app/web/include/delivery',
        filename: 'delivery.module.bundle.js'
    },
    plugins: [
            new NgAnnotatePlugin({ add: true }),

            new CopyWebpackPlugin([
                {from: './src/main/app/index.html', target: 'web/include/delivery/index.html'},
                {from: './src/main/app/delivery-task-details.html', target: 'web/include/delivery/delivery-task-details.html'},
                {from: './src/main/app/grid', target: 'web/include/delivery/grid'},
                {from: './src/main/app/img', to: '../../delivery/img'},
                {from: './node_modules/bootstrap/fonts', to: '../../fonts'}
            ]),

            new webpack.optimize.UglifyJsPlugin({
                mangle: false,
                compress: { warnings: false }
            })
    ],
    module: {
        loaders: [
          { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
      ]
    }
};
