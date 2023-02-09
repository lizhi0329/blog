[TOC]

# webpack 模块化处理

| webpack如何做到支持`commonjs`、`es module`

## esModule 与 commonJs


## webpack处理两种模块

### 处理 es module

处理 `es module` 增加了 __webpack_require__，__webpack_require__.o，__webpack_require__.r方法

如何做到import导入的状态同步: 通过对导入的模块属性定义getter方法并且绑定在exports上，会把所有的值都挂载引用模块导出的，调用的时候通过作用域链可以获取变化的值

- __webpack_require__.d： d 是 definePropertyGetters 的缩写；用来定义getter属性； 对导出的模块的属性在 exports 对象上定义一个 key value，key 为模块名称，value 为模块的可执行函数。
- __webpack_require__.o： o 是 hasOwnProperty 的缩写；判断对象是否有该属性；
- __webpack_require__.r： r 是 makeNamespaceObject 的缩写；主要是标识该模块为es模块。

```JS
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
```

```js
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "sync": () => (/* binding */ sync)
})
let sync = 'sync'
```

```js
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _es_sync__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);

console.log('es_sync', _es_sync__WEBPACK_IMPORTED_MODULE_0__.sync);

})();
```

### 对于commonJs的处理 

抛出的属性仅仅是赋值

```js
/***/ ((module) => {

module.exports.name = 'name'

module.exports.add = function(){
  return 'add'
}


/***/ })
```
```js
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const sync = __webpack_require__(1);
console.log('commonJs_sync', sync);

})();

```

### 对异步模块的处理

增加了
  - __webpack_require__.m：m 是 moduleFactories 的缩写；对__webpack_modules__的引用；
  - __webpack_require__.e：e 是 ensureChunk 的缩写； 加载异步 chunk 的方法；
  - __webpack_require__.u： u 是 getChunkScriptFilename 的缩写；获取加载chunk资源脚本部分的文件名（由ouput.chunkFilename配置确定)
  - __webpack_require__.l： l 是 loadScript 的缩写； 用来加载script标签；
  - __webpack_require__.p： p 是 publicPath 的缩写；获取公共路径（由output.publicPath配置确定）；
  - __webpack_require__.f.j： f 是 ensureChunkHandlers 的缩写；加载chunk的JSONP方法。

```js
// 原文件
import('./async').then(val => {
    console.log('async', val.async);
});

// 编译后
__webpack_require__.e("src_async_js")
  .then(__webpack_require__.bind(__webpack_require__, "./src/async.js"))
  .then(val => {console.log('async', val.async);});
```

- [参考文章](https://juejin.cn/post/7072542295144267812)