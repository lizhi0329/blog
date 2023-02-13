const pathLib = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const options = {
  // mode: "development",
  mode: 'none',
  entry: {
    commonJs_sync_index: pathLib.resolve(__dirname, "./src/commonJs_sync_index.js"),
    es_sync_index: pathLib.resolve(__dirname, "./src/es_sync_index.js"),
    async_index: pathLib.resolve(__dirname, "./src/async_index.js"),
    import_test: pathLib.resolve(__dirname, "./src/main.js"),
  },
  output: {
    path: pathLib.resolve(__dirname, "./dist"),  //出口位置
    publicPath: '',
    //initial chunk命名
    filename: 'js/[name].initial.js',
    //no-initial chunk命名
    chunkFilename: 'js/async/[name].chunk.[id].[contenthash].js',
    clean: true,
  },
  watch: true,
  watchOptions: {
    poll: 1000, // 每秒询问多少次
    aggregateTimeout: 500,  //防抖 多少毫秒后再次触发
    ignored: /node_modules/ //忽略实时监听
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: '分析 webpack 模块 : CommonJs Sync 模式',
      filename: 'commonJs_sync_index.html',
      template: 'index.html',
      chunks: ['commonJs_sync_index'],
      minify: {
        removeComments: true,   // 删除注释
        collapseWhitespace: false,  // 取消去除空格
        removeAttributeQuotes: true // 去除属性引号
      }
    }),
    new HtmlWebpackPlugin({
      title: '分析 webpack 模块 : Es Sync 模式',
      filename: 'es_sync_index.html',
      template: 'index.html',
      chunks: ['es_sync_index'],
      minify: {
        removeComments: true,
        collapseWhitespace: false,
        removeAttributeQuotes: true
      }
    }),
    new HtmlWebpackPlugin({
      title: '分析 webpack 模块 : import() 模式',
      filename: 'async_index.html',
      template: 'index.html',
      chunks: ['async_index'],
      minify: {
        removeComments: true,
        collapseWhitespace: false,
        removeAttributeQuotes: true
      }
    }),
    new HtmlWebpackPlugin({
      title: 'test_import()',
      filename: 'test_import().html',
      template: 'index.html',
      chunks: ['import_test'],
      minify: {
        removeComments: true,
        collapseWhitespace: false,
        removeAttributeQuotes: true
      }
    })
  ]
}
module.exports = options;