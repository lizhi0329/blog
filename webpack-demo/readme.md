# webpack打包分析

## `contenthash`、`hash`、`chunkhash`

1. contenthash: 只有当文件自己的内容发生改变时，其打包的 hash 值才会发生变动。

2. hash: hash针对的是每一次构建（build）而言，每一次构建之后生成的文件所带的哈希都是一致的。它关心的是整体项目的变化，只要有任意文件内容发生了更改，那么构建之后其他文件的哈希也会发生更改。

3. chunkhash: 基于的是每一个 chunk 内容的改变，如果是该 chunk 所属的内容发生了变化，那么只有该 chunk 的输出文件的哈希会发生变化，其它的不会。

例如: 

hash
├─ package.json
├─ src
│  ├─ add.js
│  ├─ index.css
│  ├─ index.js
│  └─ sub.js
├─ webpack.config.js
└─ yarn.lock

webpack.config.js 配置：

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
  entry: {
    index: './src/index.js',
    add: './src/add.js',
    sub: './src/sub.js',
  },
  mode: 'production',
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
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    minimizer: [
      new TerserPlugin({
        extractComments: false, // 是否将注释剥离到单独的文件中
      }),
      // 本插件会将 CSS 提取到单独的文件中，为每个包含 CSS 的 JS 文件创建一个 CSS 文件，并且支持 CSS 和 SourceMaps 的按需加载。
      new MiniCssExtractPlugin({ // 拆分css
        // filename: '[name].[fullhash].css',
        filename: '[name].[contenthash].css',
      }),
    ],
  },
};

```

`webpack.config.js`中 `output.filename`为`[name].[fullhash].js` 打包后所有的文件hash值相同。更改 add.js后，再次打包所有文件的 hash 值都发生了改变。
我们只改变了 add.js，受影响的只有 add.js 文件本身和依赖他的文件 index.js, 其他文件是没有必要更新hash的。


`webpack.config.js`中 `output.filename`为`[name].[chunkhash].js` 打包后 可以看到 index.js 和 index.css 是一样的，因为打包后他们属于同一个模块，
改变 add.js 再次打包 可以看到虽然公共库 lodash 和 sub.js 文件的打包值这次没有改变，除了 add.js 和 index.js 的打包值发生了变动之外， index.css 的打包 hash 值也发生了变化。
为解决这种问题 我们将拆分的 css 的 filename 设置为 `[name].[contenthash].css` 再次打包，发现 css 打包的hash值不再与 index.js 相同，它是基于自己内容打包的hash值。再次改变
add.js 再打包，此时只有 add.js和 index.js发生改变。







## webpack支持的模块类型

Webpack 天生支持如下模块类型：

- ECMAScript 模块
- CommonJS 模块
- AMD 模块
- Assets（资源模块(asset module)是一种模块类型，它允许使用资源文件（字体，图标等）而无需配置额外 loader。）
- WebAssembly 模块

通过 loader 可以使 webpack 支持多种语言和预处理器语法编写的模块。loader 向 webpack 描述了如何处理非原生模块，并将相关依赖引入到你的 bundles中。 webpack 社区已经为各种流行的语言和预处理器创建了 loader，其中包括：

- less
- stylus


## 什么是chunk?

- 每个入口文件都是一个chunk，每个chunk是由入口文件与其依赖所构成，
- 异步加载的文件也被视为是一个chunk
- chunkhash是由每次编译模块，根据模块及其依赖模块构成chunk生成对应的chunkhash, 这也就表明了每个chunk的chunkhash值都不一样， 也就是说每个chunk都是独立开来的，互不影响，每个chunk的更新不会影响其他chunk的编译构建


## webpack 默认的分包规则

- 同一个 entry 下触达到的模块组织成一个 chunk
- 异步模块单独组织为一个 chunk
- entry.runtime 单独组织成一个 chunk

> seal 阶段遍历 entry 对象，为每一个 entry 单独生成 chunk，之后再根据模块依赖图将 entry 触达到的所有模块打包进 chunk 中。

例如：

webpack 遍历 entry 对象属性 并且创建出 `chunk[main]`、`chunk[home]` 两个对象，此时的两个chunk分别包含 main、home模块

```js
module.exports = {
  entry: {
    main: "./src/main",
    home: "./src/home",
  }
};
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b001227baf6943c8a19ad68900ae2c80~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

初始化完毕后，Webpack 会读取 ModuleDependencyGraph 的内容，将 entry 所对应的内容塞入对应的 chunk (发生在 webpack/lib/buildChunkGrap.js 文件)。比如对于如下文件依赖：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a842770d983f4d42a265cf859a63e3ac~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

Main.js 以同步方式直接或间接引用了 a/b/c/d 四个文件，分析 ModuleDependencyGraph 过程会逐步将 a/b/c/d 模块逐步添加到 `chunk[main]` 中，最终形成：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b9b5015323614e178fcd5544b78a08ce~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)


> 分析 ModuleDependencyGraph 时，每次遇到异步模块都会为之创建单独的 Chunk 对象，单独打包异步模块。


## runtime 

除业务代码外，Webpack 编译产物中还需要包含一些用于支持 webpack 模块化、异步加载等特性的支撑性代码，这类代码在 webpack 中被统称为 runtime。

编译时，Webpack 会根据业务代码决定输出那些支撑特性的运行时代码(基于 Dependency 子类)，例如：

- 需要 __webpack_require__.f、__webpack_require__.r 等功能实现最起码的模块化支持
- 如果用到动态加载特性，则需要写入 __webpack_require__.e 函数
- 如果用到 Module Federation 特性，则需要写入 __webpack_require__.o 函数


## SplitChunksPlugin

默认情况下，它只会影响到按需加载的 chunks，因为修改 initial chunks 会影响到项目的 HTML 文件中的脚本标签。


