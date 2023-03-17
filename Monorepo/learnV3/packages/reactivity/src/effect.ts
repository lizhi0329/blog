// reactivity/src/effect.ts
export function effect(fn) {
  // effect 方法接收一个函数参数，需要将其保存，并执行一次；以后还会扩展出更多的功能，所以将其封装为一个 ReactiveEffect 类进行维护
  const _effect = new ReactiveEffect(fn);
  _effect.run();
}
class ReactiveEffect {
  constructor(fn) {
    this.fn = fn;
  }
  run() {
    this.fn();
  }
}
