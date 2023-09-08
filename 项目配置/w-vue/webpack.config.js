const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const StampWebpackPlugin = require('./plugin/stampPlugin')
const testPlugin = require('./plugin/testPlugin')
const { VueLoaderPlugin } = require('vue-loader')
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const SpeedMeasure  = require('speed-measure-webpack-plugin')

module.exports = {
  mode: "none",
  entry: {
    main: path.resolve(__dirname, './src/main.js'),
    page1: './src/pages/page1.js',
    page2: './src/pages/page2.js',
    page3: './src/pages/page3.js',
  },
  output: {
    path:path.resolve(__dirname, './build'), //打包后的目录
    filename: 'js/[name].[chunkhash].bundle.js',
    chunkFilename: 'js/chunk/[name].chunk.js',
    clean: true,
    // publicPath: 'static/',
    // 静态文件打包后的路径及文件名（默认是走全局的，如果有独立的设置就按照自己独立的设置来。）
    // assetModuleFilename: "assets/[name]_[hash][ext]",
  },
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: "asset", // 一般会转换为 "asset/resource"
        generator: {
          filename: "assets/img/[name]_[hash][ext]", // 独立的配置
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: path.resolve(__dirname, './loader/style-loader.js'),
          },
          {
            loader: "less-loader",
          }
        ]
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new testPlugin(),
    new SpeedMeasure(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html'),
      title: 'This is a template'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
  resolve:{  //配置模块如会解析
    extensions:['.vue','.js','.json'],//引入这些文件 可以不带后缀 按顺序解析
    alias:{
        '@': path.resolve(__dirname, 'src'), //@方式引入资源
    }
 },
  devServer: {
    static: path.resolve(__dirname, '../dist'),
    port: 3000,
    open: true,
    hot: true
  },
}