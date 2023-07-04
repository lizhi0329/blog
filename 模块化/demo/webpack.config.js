const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const options = {
  mode: "development",
  // mode: "none",
  entry: {
    cjs_index: path.resolve(__dirname, "./src/cjs/index.js"),
    ejs_index: path.resolve(__dirname, "./src/ejs/index.js"),
    async_index: path.resolve(__dirname, "./src/async/index.js"),
  },
  output: {
    path: path.resolve(__dirname, "./dist"), //出口位置
    publicPath: "",
    //initial chunk命名
    filename: "js/[name].initial.js",
    //no-initial chunk命名
    chunkFilename: "js/async/[name].chunk.[id].[contenthash].js",
    clean: true,
  },
  devtool: false,
  watch: true,
  watchOptions: {
    poll: 1000, // 每秒询问多少次
    aggregateTimeout: 500, //防抖 多少毫秒后再次触发
    ignored: /node_modules/, //忽略实时监听
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "分析 webpack 模块 : CommonJs Sync 模式",
      filename: "cjs_index.html",
      template: "index.html",
      chunks: ["cjs_index"],
    }),
    new HtmlWebpackPlugin({
      title: "分析 webpack 模块 : es module Sync 模式",
      filename: "ejs_index.html",
      template: "index.html",
      chunks: ["ejs_index"],
    }),
    new HtmlWebpackPlugin({
      title: "分析 webpack 模块 : es module async 模式",
      filename: "async_index.html",
      template: "index.html",
      chunks: ["async_index"],
    }),
  ],
};
module.exports = options;
