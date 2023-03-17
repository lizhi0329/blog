const HtmlWebpackPlugin = require("html-webpack-plugin");
const InlineSourcePlugin = require("html-webpack-inline-source-plugin");
const pathLib = require("path");
const options = {
  // mode: "development",
  mode: "none",
  entry: {
    index: pathLib.resolve(__dirname, "./src/index.js"),
  },
  output: {
    path: pathLib.resolve(__dirname, "./dist"), //出口位置
    publicPath: "",
    //initial chunk命名
    filename: "js/[name].[chunkhash].js",
    //no-initial chunk命名
    chunkFilename: "js/[name].chunk.[id].[contenthash].js",
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      // template: "index.html",
      inlineSource: "js/runtime~.+\\.js",
      // chunks: ["import_test"],
      // minify: {
      //   removeComments: true,
      //   collapseWhitespace: false,
      //   removeAttributeQuotes: true,
      // },
    }),
    new InlineSourcePlugin(),
  ],
  optimization: {
    runtimeChunk: true, // 抽离
    // splitChunks: {
    //   chunks: "all",
    // },
  },
};
module.exports = options;
