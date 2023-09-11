- [pnpm](#pnpm)
  - [npm、yarn、pnpm](#npmyarnpnpm)
  - [dependencies、devDependencies、peerDependencies 的区别](#dependenciesdevdependenciespeerdependencies-的区别)
    - [peerDependencies](#peerdependencies)


# pnpm

> Pnpm 是新一代的 nodejs 包管理工具。第一个 “P”意为 `Performance`，代表着更佳的性能。

优点：
- 采用了 hard-link 机制，避免了包的重复安装，节省了空间，同时能提高项目依赖的安装速度。
- 对 monorepo 的支持非常友好，只需要一条配置就能实现


## npm、yarn、pnpm


在npm2时代，npm 安装一个依赖会把依赖包和它的依赖都会被下载下来，例如：

```js
// 项目
├── node_modules
|   ├── express    
        ├── node_modules
            ├── xxxxx // express的依赖
```
每一层依赖都有自己的node_modules，层层嵌套，这样存在的问题：  

- 多个包之间难免会有公共的依，但是不能复用。
- windows 的文件路径最大长度260 多个字符，这样下去迟早会超过。

而yarn将包全部铺平在了一层，包下面仍可能存在node_modules，因为可能一个包有多个版本，只会提升一个（具体提升哪个版本的，看在package.json中哪个定义在前），后面的依然采用嵌套的方式。
后来 npm3 也采用了类似的处理方式。

这样也会出现一个问题就是`幽灵依赖`, 也就是你明明没有声明在 dependencies 里的依赖，但在代码里却可以 require 进来。

而pnpm 将包本身和依赖放在同一个 node_modules 下面，实现了与原生 require() 的兼容。 依赖都是以软链接的形式引入，其本体也以同样的结构组织起来。 于是，所有的包的依赖文件结构，都与其 package.json 中的声明保持一致，不再如先前一般让人眼花缭乱。

pnpm 的依赖文件结构与 package.json 中的声明保持一致，因此，我们将不能再访问 package.json 中未声明的包。 这解决了 npm / yarn 一直依赖的幽灵依赖问题，提升了依赖访问的安全性。

pnpm 安装的依赖：

![pnpm 安装的依赖](../../img/pnpm.png)


 ## dependencies、devDependencies、peerDependencies 的区别

 每个项目的 package.json 文件内都声明了项目的依赖，其中有三种类型，`dependencies`、`devDependencies`、`peerDependencies`。

 各种包管理器处理 dependencies 和 devDependencies 差异的行为都发生在依赖安装时期，即 `npm install` 的过程中。

 假设我们有项目 a，其 package.json 结构如下：

```json
{
  "name": "a",
  "dependencies": {
    "b": "^1.0.0"
  },
  "devDependencies": {
    "c": "^1.0.0"
  }
}

```

a 的依赖 b 和 c 的依赖信息如下：

```json
// node_modules/b/package.json
{
  "name": "b",
  "dependencies": {
    "d": "^1.0.0"
  },
  "devDependencies": {
    "e": "^1.0.0"
  }
}

```

```json
// node_modules/c/package.json
{
  "name": "c",
  "dependencies": {
    "f": "^1.0.0"
  },
  "devDependencies": {
    "g": "^1.0.0"
  }
}

```

我们用实线表示 dependencies 依赖，用虚线表示 devDependencies 依赖，项目 a 的依赖树如下表:

![依赖关系](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b672e20a555743a4ac59cf4d39a1d29e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

执行 npm install 后，a 的 node_modules 目录最终内容如下：

```
node_modules
├── b       // a 的 dependencies
├── c       // a 的 devDependencies   
├── d       // b 的 dependencies    
└── f       // c 的 dependencies  

```
所以，会安装以package.json 为起点的 dependencies 和 devDependencies依赖，而 作为依赖中 则只会安装 dependencies 中的依赖。


### peerDependencies

peerDependencies 声明包的同步依赖。但是包管理器不会像 dependencies 一样，自动为用户安装好依赖，当用户使用包时，必须遵照该包的 peerDependencies 同步安装对应的依赖，否则包管理器会提示错误。

peerDependencies 的使用场景一般是核心库的周边插件，例如 vue 之于 vuex，或者 vite 之于 @vitejs/plugin-vue2，插件一般是不能独立于核心库而单独工作的。

例如：

```json
// @vitejs/plugin-vue2 的 package.json
{
  "name": "@vitejs/plugin-vue2",
  // ...
  "peerDependencies": {
    "vite": ">=2.5.10",
    "vue": "^2.7.0-0"
  },
  // dependencies、devDependencies 与其他字段 ...
}

```