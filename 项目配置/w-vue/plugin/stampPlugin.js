// 根目录 > stamp-webpack-plugin.js
 
const HtmlWebpackPlugin = require('html-webpack-plugin');  // +++ 引入html-webpack-plugin

class StampPlugin { // 创建一个时间戳插件
  apply(compiler) {
    // 使用 compilation 生命周期保证 plugin 执行在 文件创建之前
    // compiler 创建的 compilation 对象在回调中被使用
    compiler.hooks.compilation.tap('StampWebpackPlugin', (compilation, callback) => { // 注册一个StampWebpackPlugin方法
      
      // HtmlWebpackPlugin在webpack刚创建编译的时候执行自带的beforeAssetTagGeneration生命周期
      HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tap('StampWebpackPlugin', 
        (htmlPluginData, cb) => {
          // console.log(htmlPluginData);
          let jsSrc = htmlPluginData.assets.js[0]  // ++++++
          // 直接修改js数组内的元素
          htmlPluginData.assets.js[0] = `${jsSrc}?${new Date().getTime()}` 
          console.log(htmlPluginData, 'htmlPluginData');
        }
      )
    })
  }
}

module.exports = StampPlugin
