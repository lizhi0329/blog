const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  entry: {
    index: './src/index.js',
    add: './src/add.js',
    sub: './src/sub.js',
  },
  mode: 'production',
  // mode: 'development',
  output: {
    path: path.resolve(__dirname, './dist'),
    // filename: '[name].[fullhash].js',
    filename: '[name].[chunkhash].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'compare hash',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
      new MiniCssExtractPlugin({
        // filename: '[name].[fullhash].css',
        filename: '[name].[contenthash].css',
      }),
    ],
  },
};
