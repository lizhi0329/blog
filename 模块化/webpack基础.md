- [基础概念](#基础概念)
- [大概流程](#大概流程)
- [hot-module-serve](#hot-module-serve)
- [执行webpack serve命令发生了啥？](#执行webpack-serve命令发生了啥)
- [webpack tree-sharking](#webpack-tree-sharking)

todo：hmr、webpack serve

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



## 执行webpack serve命令发生了啥？

1. 执行 webpack serve 命令会去找 node_modules 下面的 bin 中的 webpack文件。

次文件内容：

```sh
#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')") // 将当前脚本文件的目录路径赋值给 basedir 变量

...省略中间的 
else
  exec node  "$basedir/../webpack/bin/webpack.js" "$@" // 最中走的是这个命令
fi

```

再看 webpack/bin/webpack.js中：

```js
...前面的先省略

if (!cli.installed) { // 这里判断 webpack-cli有没有装
  ...这些代码太多啦，我省略了，下面是大概步骤解释省略的
  // 没有装它提示你没有装，然后分析 yarn.lock、pnpm-lock.yaml、npm-lock来判断你用的哪一种包管理器 packageManager
  // 然后问你要不要装，要装就装，不装拉到退出
	runCommand(packageManager, installOptions.concat(cli.package))
   .then(() => {
    // 装了执行 runCli
   	runCli(cli);
   })
   .catch(error => {
   	console.error(error);
   	process.exitCode = 1;
   });

} else {
  // cli 中有啥？
  /**
    * @typedef {Object} CliOption
    * @property {string} name display name  这里是'webpack-cli'
    * @property {string} package npm package name  这里是'webpack-cli'
    * @property {string} binName name of the executable file 这里是 'webpack-cli'
    * @property {boolean} installed currently installed? 这是true
    * @property {string} url homepage 这里是 'https://github.com/webpack/webpack-cli'
    */

	runCli(cli);
}
```

runCli都是干嘛的？

```js
const runCli = cli => {
	const path = require("path");
	const pkgPath = require.resolve(`${cli.package}/package.json`); // webpack-cli/package.json
	const pkg = require(pkgPath);

	if (pkg.type === "module" || /\.mjs/i.test(pkg.bin[cli.binName])) { // 判断 package.json 中type是不是module属性。
  // pkg中的 bin脚本命令 webpack-cli 是不是mjs结尾，结果不是.js结尾, 所以走入else
		import(path.resolve(path.dirname(pkgPath), pkg.bin[cli.binName])).catch(
			error => {
				console.error(error);
				process.exitCode = 1;
			}
		);
	} else {
    // 把 webpack-cli/bin/cli.js 加载过来
		require(path.resolve(path.dirname(pkgPath), pkg.bin[cli.binName]));
	}
};
```
⚠️注意：

package.json中的 type 字段用于指定当前包的主入口文件的类型（即模块类型），以便 Node.js 和其他工具能够正确地处理它。
type 字段的取值如下：

- "commonjs"：表示当前包的主入口文件使用 CommonJS 规范导出模块，这是 Node.js 默认的模块系统，也是大多数 Node.js 包使用的模块系统。

- "module"：表示当前包的主入口文件使用 ECMAScript 模块规范导出模块。这是一个相对较新的模块系统，可以使用 import 和 export 语句导入和导出模块。

- "json"：表示当前包的主入口文件是一个 JSON 文件。

- "browser"：表示当前包的主入口文件是一个浏览器端的 JavaScript 文件，可以在浏览器中直接使用。


在 webpack-cli/bin/cli.js 中：

```js
"use strict";
const importLocal = require("import-local");
const runCLI = require("../lib/bootstrap");

if (!process.env.WEBPACK_CLI_SKIP_IMPORT_LOCAL) {
  // Prefer the local installation of `webpack-cli`
  if (importLocal(__filename)) {
    return;
  }
}
process.title = "webpack";
runCLI(process.argv); //  执行 webpack-cli/lib/bootstrap 中的 runCli方法。
```

webpack-cli/lib/bootstrap中：

```js
const WebpackCLI = require("./webpack-cli");
const runCLI = async (args) => {
    const cli = new WebpackCLI();
    try {
        await cli.run(args); // webpackcli实例中的run方法 此时args [
        //   '/usr/local/bin/node',
        //   '/Users/lizhi/Documents/webpack-demo/node_modules/webpack/bin/webpack.js',
        //   'serve'
        // ]
    }
    catch (error) {
        cli.logger.error(error);
        process.exit(2);
    }
};
module.exports = runCLI;

```

webpack-cli中的 run方法：

```js
async run(args, parseOptions) {
  // ...一些命令的list省略
  const buildCommandOptions = {}
  const watchCommandOptions = {}
  const versionCommandOptions = {}
  const helpCommandOptions = {}
  const externalBuiltInCommandsInfo = []
  // ...省略
  this.program.action(async (options, program) => {
    //...
     let commandToRun = operand; // 'serve'
      let commandOperands = operands.slice(1);
      if (isKnownCommand(commandToRun)) { // 从命令中找是否认识
          await loadCommandByName(commandToRun, true);
          
      }
  }

  async loadCommandByName() {
    // loadCommandByName 中 判断不是build 不是 help等命令。执行

    const builtInExternalCommandInfo = {
      alias: ['server', 's']
      name: 'serve [entries...]'
      pkg: '@webpack-cli/serve'
    }

    let pkg = '@webpack-cli/serve'
    let loadedCommand = await this.tryRequireThenImport(pkg, false); // 将‘@webpack-cli/serve' 导入进来了
    let command
    command = new loadedCommand();
    await command.apply(this); // 执行 ‘@webpack-cli/serve'方法了，启服务
  }
}
```

调用的 @webpack-cli/serve 的apply方法，该方法中会执行cli的serve命令：

```js
  await cli.makeCommand({
      name: "serve [entries...]",
      alias: ["server", "s"],
      description: "Run the webpack dev server and watch for source file changes while serving.",
      usage: "[entries...] [options]",
      pkg: "@webpack-cli/serve",
      dependencies: [WEBPACK_PACKAGE, WEBPACK_DEV_SERVER_PACKAGE],
  }, async () => {
      let devServerFlags = [];
      cli.webpack = await cli.loadWebpack(); // 加载webpack资源，并且挂到cli上
      try {
          devServerFlags = loadDevServerOptions(); // 加载 webpack-dev-server
      }
      catch (error) {
          cli.logger.error(`You need to install 'webpack-dev-server' for running 'webpack serve'.\n${error}`);
          process.exit(2);
      }
      const builtInOptions = cli.getBuiltInOptions();
      return [...builtInOptions, ...devServerFlags];
  }, 
```



## webpack tree-sharking

tree-sharking 作用是将没有用的代码移除。

在webpack项目中生产环境默认开启了，也就是webpack配置中的：

```js
  optimization: {
    usedExports: true, //  这个属性这个会告诉 webpack 去收集 export 或 import 的变量在程序中是否用到，并以注释的形式标记出来。
  }
```

开启这个后会在静态分析后 将没有用到过的标记， 例如：

```js
/* unused harmony export getName */
const getName = () => {
  console.log('es getName');
}

```

当开启压缩后 `minimize: true` ，webpack5默认开启`terser`进行压缩
而`terser`将会对标记的代码进行移除。

还有一种影响webpack 进行tree-shaking的，那就是 sideEffects：
这个字段用来表示文件是否有副作用，可选三个字段：

- true：所有文件都有副作用，不可以 tree-shaking
- false：所有文件没有副作用，可以 tree-shaking
- 数组：只有数组中的文件有副作用，其它的都可以 tree-shaking 

这些阶段 标记发生在seal阶段中（遍历 ModuleGraph 标记模块导出变量有没有被使用）
而删除则发生在emit阶段中（生成产物时，若变量没有被其它模块使用则删除对应的导出语句）
