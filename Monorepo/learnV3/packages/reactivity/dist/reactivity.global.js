var VueReactivity = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/reactivity/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    effect: () => effect,
    reactive: () => reactive
  });

  // packages/shared/src/index.ts
  var isObject = (value) => {
    return typeof value === "object" && value !== null;
  };
  var isArray = Array.isArray;

  // packages/reactivity/src/reactive.ts
  var reactiveMap = /* @__PURE__ */ new WeakMap();
  function reactive(target) {
    if (!isObject(target)) {
      return target;
    }
    const exiting = reactiveMap.get(target);
    if (exiting) {
      return exiting;
    }
    const handler = {
      get(target2, key, receiver) {
        return Reflect.get(target2, key);
      },
      set(target2, key, value, receiver) {
        console.log(`${key}\u5C5E\u6027\u53D8\u5316\u4E86\uFF0C\u6D3E\u53D1\u66F4\u65B0`);
        if (target2[key] !== value) {
          const result = Reflect.set(target2, key, value, receiver);
          return result;
        }
      }
    };
    const proxy = new Proxy(target, handler);
    reactiveMap.set(target, proxy);
    return proxy;
  }

  // packages/reactivity/src/effect.ts
  function effect(fn) {
    const _effect = new ReactiveEffect(fn);
    _effect.run();
  }
  var ReactiveEffect = class {
    constructor(fn) {
      this.fn = fn;
    }
    run() {
      this.fn();
    }
  };
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=reactivity.global.js.map
