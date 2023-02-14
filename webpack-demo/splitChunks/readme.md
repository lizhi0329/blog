# 打包分析

## `contenthash`、`hash`、`chunkhash`

1. contenthash: 输出文件内容的 md4-hash。
2. hash: hash针对的是每一次构建（build）而言，每一次构建之后生成的文件所带的哈希都是一致的。它关心的是整体项目的变化，只要有任意文件内容发生了更改，那么构建之后其他文件的哈希也会发生更改。
3. chunkhash: 基于的是每一个 chunk 内容的改变，如果是该 chunk 所属的内容发生了变化，那么只有该 chunk 的输出文件的哈希会发生变化，其它的不会

## webpack中模块的概念

在模块化编程中，开发者将程序分解为功能离散的 chunk，并称之为 **模块**。

每个模块都拥有小于完整程序的体积，使得验证、调试及测试变得轻而易举。 精心编写**模**提供了可靠的抽象和封装界限，使得应用程序中每个模块都具备了条理清晰的设计和明确的目的。


## webpack支持的模块类型

Webpack 天生支持如下模块类型：

- ECMAScript 模块
- CommonJS 模块
- AMD 模块
- Assets（资源模块(asset module)是一种模块类型，它允许使用资源文件（字体，图标等）而无需配置额外 loader。）
- WebAssembly 模块

通过 loader 可以使 webpack 支持多种语言和预处理器语法编写的模块。loader 向 webpack 描述了如何处理非原生模块，并将相关依赖引入到你的 bundles中。 webpack 社区已经为各种流行的语言和预处理器创建了 loader，其中包括：
◊
- less◊
- stylus


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




