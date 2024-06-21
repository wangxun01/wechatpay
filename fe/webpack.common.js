const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
    entry: path.join(__dirname, 'src/main.js'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'js/[name].[hash].js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.san$/,
                use: 'san-loader',
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.(png|jpe?g|gif|gltf|glb|svg|ico)$/,
                use: [{loader: 'url-loader'}]
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'index.html'),
            inject: 'body',
            favicon: path.resolve('favicon.ico')
        }),
        new CleanWebpackPlugin()
    ]
};