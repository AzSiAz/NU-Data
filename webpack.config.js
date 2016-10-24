const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = {
    target: 'node',
    // externals: [nodeExternals()],
    entry: ['babel-polyfill', './src/index.js'],
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
            loader: 'babel' 
        }]
    },
}