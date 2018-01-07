const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production'; // returns true or false
const cssDev = ['style-loader', 'css-loader', 'sass-loader'];
const cssProd = ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: ['css-loader', 'sass-loader'],
    publicPath: '/dist'
});

const cssConfig = isProduction ? cssProd : cssDev;

module.exports = {
    entry: {
        app: './develope/app.js',
        contact: './develope/contact.js'
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].bundle.js'
    },
    module: {
        loaders: [{
                test: /\.scss$/,
                use: cssConfig
            },
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                use: 'babel-loader'
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: 'file-loader'
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 9000,
        stats: 'errors-only',
        compress: true,
        hot: true,
        open: 'chrome'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Project Demo',
            minify: {
                collapseWhitespace: true
            },
            hash: true,
            excludeChunks: ['contact'],
            contact: 'index.html',
            template: './develope/index.html'
        }),
        new HtmlWebpackPlugin({
            title: 'Contact page',
            minify: {
                collapseWhitespace: true
            },
            hash: true,
            chunks: ['contact'],
            filename: 'contact.html',
            template: './develope/contact.html'
        }),
        new ExtractTextPlugin({
            filename: '[name].css',
            disable: !isProduction,
            allChunks: true
        }),
        // enable HMR
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ]
}