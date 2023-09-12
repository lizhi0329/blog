## 基础概念

- `Entry`：入口，Webpack 执行构建的第一步将从 Entry 开始，可抽象成输入。
- `Module`：模块，在 Webpack 里一切皆模块，一个模块对应着一个文件。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块。
- `Chunk`：代码块，一个 Chunk 由多个模块组合而成，用于代码合并与分割。
- `Loader`：模块转换器，用于把模块原内容按照需求转换成新内容。
- `Plugin`：扩展插件，在 Webpack 构建流程中的特定时机会广播出对应的事件，插件可以监听这些事件的发生，在特定时机做对应的事情。

## 大概流程

Webpack 的运行流程是一个串行的过程，从启动到结束会依次执行以下流程：

1. 初始化参数：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数；
2. 开始编译：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译；
3. 确定入口：根据配置中的 entry 找出所有的入口文件。
4. 编译模块：从入口文件开始，调用对应的 loader 编译所有的模块，遇到模块的依赖，则会递归寻找模块进行编译，直到所有入口依赖的文件都经过了本步骤的处理。
5. 完成模块编译：在经过第4步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系。
6. 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会；
7. 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统。

webpack的构建流程大概可以分三大阶段：

1. 初始化：启动构建，读取与合并配置参数，加载 Plugin，实例化 Compiler。
2. 编译：从 Entry 发出，针对每个 Module 串行调用对应的 Loader 去翻译文件内容，再找到该 Module 依赖的 Module，递归地进行编译处。
3. 输出：对编译后的 Module 组合成 Chunk，把 Chunk 转换成文件，输出到文件系统。

![webpack构建流程](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4dfc039f8e5d4a479de1c219b6ecaf74~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

从入口模块开始解析依赖，分别用对应的 loader 来做模块的编译，然后生成模块依赖图 ModuleGraph，这个阶段叫做 make。

这些 module 要按照不同的规则来分组，也就是分到不同的 chunk 里，这样 ModuleGraph 就变成了 ChunkGraph，这个阶段叫做 seal。

最后，不同类型的 chunk 用不同的模版打印成对应的代码，然后输出为 js 就好了，这个阶段叫做 emit。


## hot-module-serve

当执行本地运行命令后，devServe会启动一个本地服务器与浏览器建立 websocket 链接， 同时会watch本地代码变更重新打包，推送文件变动的消息。
浏览器的 webpack runtime 收到变动消息之后，会下载对应的 xxx.hot-update.json 和 xxx.hot-update.js 文件

![hmr](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2fc6feba9cef4c66940d43ce9e23eb1b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

## 分析

1. 为什么打包后的 bundle.js 能直接运行在浏览器中？



<!-- https://juejin.cn/post/6844903614469636103 -->