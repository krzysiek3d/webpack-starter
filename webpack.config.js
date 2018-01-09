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
// enable HMR if not in production mode
const hmr = !isProduction ? [new webpack.HotModuleReplacementPlugin(), new webpack.NamedModulesPlugin()] : [];

module.exports = {
    entry: {
        index: './develope/js/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    module: {
        loaders: [{
                test: /\.scss$/,
                use: cssConfig
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['babel-preset-es3'].map(require.resolve)
                }
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
            template: './develope/index.html'
        }),
        new ExtractTextPlugin({
            filename: '[name].css',
            disable: !isProduction,
            allChunks: true
        }),
        // enable HMR if not in production mode
    ].concat(hmr)
}