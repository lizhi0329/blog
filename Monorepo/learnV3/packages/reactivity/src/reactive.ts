import { isObject } from "@v3/shared";

// 只能实现对象数据的响应式
// 同一个对象，只会被代理一次
// 被代理过的对象，不会被再次代理
// 支持嵌套属性的响应式

const reactiveMap = new WeakMap();

export function reactive(target) {
  // 只能代理对象
  if (!isObject(target)) {
    return target;
  }
  const exiting = reactiveMap.get(target);
  if (exiting) {
    return exiting;
  }
  const handler = {
    get(target, key, receiver) {
      return Reflect.get(target, key);
    },
    set(target, key, value, receiver) {
      console.log(`${key}属性变化了，派发更新`);
      // 当属性的新值和旧值不同时，再进行设置
      if (target[key] !== value) {
        const result = Reflect.set(target, key, value, receiver);
        return result;
      }
    },
  };

  const proxy = new Proxy(target, handler);
  // 同一个对象，只会被代理一次
  // 缓存代理过的
  reactiveMap.set(target, proxy);
  return proxy;
}
