const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = {
    entry: ['./src/index.js'],
    target: 'node',
    externals: [nodeExternals()],
    devtool: 'sourcemap',
    output: {
        path: './dist',
        filename: 'build.js',
        libraryTarget: 'umd'
    },
    module: {
        loaders: [{
            test: /\.js?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        }]
    },
}