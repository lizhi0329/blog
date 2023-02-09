"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newName = exports.name = exports.getName = exports["default"] = exports.age = void 0;
exports.test = test;
exports.year = void 0;
// 命名输出
var name = 'es module';
exports.newName = exports.name = name;
var getName = function getName() {
  return name;
};
exports.getName = getName;
function test() {
  return name;
}

// 指定输出的一组变量
var year = 2023;
exports.year = year;
var age = 18;
exports.age = age;
// 默认输出
// 一个模块中只能有一个默认导出export default， 即只能使用一次
var _default = test; // export default {
//   test,
//   name
// }
exports["default"] = _default;