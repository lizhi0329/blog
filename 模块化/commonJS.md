# 概述

> 每个文件就是一个模块，有自己的作用域。在一个文件里面定义的变量、函数、类，都是私有的，对其他文件不可见
> CommonJS 规范还规定，每个模块内部有两个变量可以使用，require 和 module。

## **require 用来加载某个模块**

require 命令的基本功能是，读入并执行一个 js 文件，然后返回该模块的 exports 对象。如果没有发现指定模块，会报错。
CommonJS 模块的加载机制是，require 的是被导出的值的拷贝。也就是说，一旦导出一个值，模块内部的变化就影响不到这个值 。

## module

**module 代表当前模块，是一个对象，保存了当前模块的信息。exports 是 module 上的一个属性，保存了当前模块要导出的接口或者变量，使用 require 加载的某个模块获取到的值就是那个模块使用 exports 导出的值**

```js
// a.js
var name = 'morrain'
var age = 18
module.exports.name = name
module.exports.getAge = function(){
    return age
}
 
//b.js
var a = require('a.js')
console.log(a.name) // 'morrain'
console.log(a.getAge())// 18
```

```js
// a.js
var name = 'morrain'
var age = 18
exports.name = name
exports.getAge = function(){
    return age
}
```