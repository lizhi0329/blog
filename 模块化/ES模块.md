[toc]

# es module

| 前言

在早期 JavaScript 模块这一概念，都是通过 script 标签引入 js 文件代码。
这样会导致的问题：

- js 文件作用域都是顶层，这会造成变量污染。
- js 文件多，变得不好维护。
- js 文件依赖问题，稍微不注意顺序引入错，代码全报错

## type="module"

通过 给 `script` 标签加上 `type = "module"` 属性表明这是一个 ESM 模块。
带此属性的 script 有以下特点：

1. 每个 script 是一个作用域。
2. 采用严格模式 this 不可用
3. 发送 cors 请求
4. script 标签采用类似 defer 模式 不会阻塞主代码进行

例如：
打印结果 1 2 再弹出 alert

```html
<script>
  console.log("1");
</script>
<script type="module">
  alert("hello");
</script>
<script>
  console.log("2");
</script>
```

## es module 优势

Es Module 的产生有很多优势：

- 借助 `Es Module`的静态导入导出的优势，实现了 tree sharking。
- `Es Module` 还可以 `import()` 懒加载方式实现代码分割。

> ps:如何理解 import 语句是静态执行的和 require 函数是动态执行的?
> 理解 import 语句是静态执行的和 require 函数是动态执行的，需要先了解这两个概念的含义。
> 静态执行是指在编译阶段就能够确定其执行结果的代码执行方式。在 JavaScript 中，import 语句属于静态执行的代码，也就是说，当 JavaScript 引擎执行代码时，会在编译阶段对 import 语句进行静态分析，确定所导入的模块，并在运行时加载这些模块。
> 动态执行是指在运行时才能确定其执行结果的代码执行方式。在 JavaScript 中，require 函数属于动态执行的代码，也就是说，当 JavaScript 引擎执行代码时，会在运行时动态地确定所需的模块，并加载这些模块。
> 因此，可以理解为：

> import 语句是静态执行的，因为在编译阶段就能够确定所导入的模块，从而在运行时快速加载这些模块。
> require 函数是动态执行的，因为在运行时才能够确定所需的模块，需要动态地加载这些模块。

> 值得注意的是，由于 import 语句是静态执行的，因此在代码中不能使用变量或表达式作为模块路径，而只能使用字符串字面量。而 require 函数则可以接受变量或表达式作为模块路径，从而动态地确定所需的模块。

## 用法组合

在 `Es Module` 中用 `export` 用来导出模块，`import` 用来导入模块。

`export` 命令用于规定模块的对外接口
在创建 JavaScript 模块时，export 语句用于从模块中导出实时绑定的函数、对象或原始值，以便其他程序可以通过 import 语句使用它们。被导出的绑定值依然可以在本地进行修改。在使用 import 进行导入时，这些绑定值只能被导入模块所读取，但在 export 导出模块中对这些绑定值进行修改，所修改的值也会实时地更新。

```js
// 命名输出
export const name = "es module";
export const getName = () => {
  return name;
};
export function test() {
  return name;
}

// 指定输出的一组变量
const year = 2023;
const age = 18;
export {
  year,
  age,
  // 支持重命名 通过as
  name as newName,
};

// 默认输出
// 一个模块中只能有一个默认导出export default， 即只能使用一次
export default test;
// export default {
//   test,
//   name
// }

// 重定向导出
export * from "./1.js"; // 第一种方式
export { name, getName } from "./1.js"; // 第二种方式
export { name as otherName } from "./1.js"; //第三种方式
```

import 命令用于输入指定模块提供的功能

```js
// 命名输出，支持as重命名
import { test, getName, name as newName } from "./modules/1.js";
// 整体输入
import * as m1 from "./modules/1.js";

console.log(getName(), m1, test(), newName);
```

## 特性

- ES6 module 的引入和导出是静态的，import 会自动提升到代码的顶层 ，import , export 不能放在块级作用域或条件语句中：

```js
// 错误❎
isexport &&  export const  name = '《React进阶实践指南》'

function say(){
  import name from './a.js'
  export const author = '我不是外星人'
}
```

- 这种静态语法，在编译过程中确定了导入和导出的关系，所以更方便去查找依赖，更方便去 tree shaking (摇树) ， 可以使用 lint 工具对模块依赖进行检查，可以对导入导出加上类型信息进行静态的类型检查。

- ES6 模块*提前加载并执行模块文件*，ES6 模块在预处理阶段分析模块依赖，在执行阶段执行模块，两个阶段都采用深度优先遍历，执行顺序是子 -> 父。

示例：

```js
//app.js
console.log('main.js开始执行')
import say from './modules/3.js'
import say1 from './modules/4.js'
console.log('main.js执行完毕')

//3.js
console.log('3 模块加载')
import b from './4.js'
export default function say (){
    console.log('hello , 3')
}

//4.js
console.log('4 模块加载')
export default function sayhello(){
    console.log('hello, 4')
}

// 执行顺序
// 4 模块加载
// 3 模块加载
// main.js开始执行
// main.js执行完毕
```

- 使用 import 被导入的变量是只读的，可以理解默认为 const 装饰，无法被赋值。
- 使用 import 被导入的变量是与原变量绑定/引用的，可以理解为 import 导入的变量无论是否为基本类型都是引用传递。

## import()

- `import()` 可以动态使用，加载模块。
- `import()` 返回一个 `Promise` 对象， 返回的 Promise 的 then 成功回调中，可以获取模块的加载成功信息。

```js
// babel转换后的动态导入
Promise.resolve()
  .then(function () {
    return _interopRequireWildcard(require("./modules/5.js"));
  })
  .then(function (res) {
    console.log(res, "res");
  });
```

## 总结

- ES6 Module 静态的，不能放在块级作用域内，Es Module 语句运行在代码编译时。。
- ES6 Module 的值是动态绑定的，可以通过导出方法修改，可以直接访问修改结果。
- ES6 Module 可以导出多个属性和方法，可以单个导入导出，混合导入导出。
- ES6 模块提前加载并执行模块文件
