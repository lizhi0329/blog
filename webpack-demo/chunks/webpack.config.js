const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports = {
  mode: 'none',
  // mode: 'development',
  entry: {
    index_bundle: path.resolve(__dirname, 'src/index.js'),
    main_bundle: path.resolve(__dirname, 'src/main.js'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    chunkFilename: 'chunk/[name].[contenthash].js',
    clean: true,
  },
  watch: true,
  watchOptions: {
    poll: 1000, // 每秒询问多少次
    aggregateTimeout: 500,  //防抖 多少毫秒后再次触发
    ignored: /node_modules/ //忽略实时监听
  },
  plugins: [
    new BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({
      title: '分析 splitChunks',
      filename: 'index.html',
      // template: 'index.html',
      minify: {
        removeComments: true,   // 删除注释
        collapseWhitespace: false,  // 取消去除空格
        removeAttributeQuotes: true // 去除属性引号
      }
    }),
  ],
  optimization: {
    // runtimeChunk: true,
    splitChunks: {
      // chunks: '', // initial、async和all。它指示应该  优先  分离同步（initial）、异步（async）还是所有的代码模块。
      maxInitialRequests: Infinity,
      minSize: 0,
      // cacheGroups: {
      //   vendor: {
      //     test: /[\\/]node_modules[\\/]/,
      //     name(module) {
      //       // get the name. E.g. node_modules/packageName/not/this/part.js
      //       // or node_modules/packageName
      //       const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

      //       // npm package names are URL-safe, but some servers don't like @ symbols
      //       return `npm.${packageName.replace('@', '')}`;
      //     },
      //   },
      // }
    }
  }
};