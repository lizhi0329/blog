// webpack.config.js
const path = require('path');
const webpack = require('webpack');
const FileListPlugin = require('./src/plugins/FileList');

module.exports = {
    mode: 'development',
    entry: {
        index: './src/index.js',
    },
    devtool: 'inline-source-map',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    resolveLoader: {
        modules: ['node_modules', './src/loaders']
    },
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif)$/,
                loader: 'file-loader',
                type: 'javascript/auto' //让webpack把这些资源当成js处理，不要使用内部的资源处理程序去处理
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                loader: 'image-loader',
                type: 'javascript/auto' //让webpack把这些资源当成js处理，不要使用内部的资源处理程序去处理
            },
            {
                test: /.js$/i,
                // use: ['loader'],
                use: [
                    {
                        loader: 'eslint-loader',
                        options: {
                            fix: true,
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new  FileListPlugin()
    ]
};