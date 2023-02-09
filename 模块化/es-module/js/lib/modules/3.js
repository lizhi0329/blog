"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = say;
var _ = _interopRequireDefault(require("./4.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
console.log('3 模块加载');
function say() {
  console.log('hello , 3');
}