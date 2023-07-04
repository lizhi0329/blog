## 什么是进程？

进程（Process）是计算机中正在运行的程序的实例。当一个程序被执行时，操作系统会为这个程序创建一个进程，并分配一些系统资源（如CPU时间、内存空间等）给这个进程。进程通常包含一个或多个线程（Thread），每个线程执行不同的任务，但是共享进程的资源和内存空间。

在多任务操作系统中，可以同时运行多个进程，每个进程都是独立的、互不干扰的，它们可以并发执行，从而提高计算机的效率和性能。操作系统通过进程调度（Process Scheduling）机制来控制进程的执行，以保证系统的稳定性和效率。

进程具有以下特点：

- 独立性：每个进程都是独立的，有自己的独立的内存空间和系统资源。

- 并发性：多个进程可以同时运行，共享计算机的资源。

- 动态性：进程的创建和销毁是动态的，可以随时创建和销毁。

- 随机性：进程的执行顺序和时间是不确定的，取决于系统的调度算法和各个进程的优先级。

- 系统开销：每个进程都需要占用一定的系统资源，包括内存、CPU时间、I/O等，因此需要合理管理和控制进程的数量和资源占用。


## 什么是线程？

线程（Thread）是计算机中最小的执行单元，是进程中的一个实体，负责程序的执行。一个进程可以包含多个线程，每个线程可以独立执行不同的任务，但是共享进程的资源和内存空间。

线程有以下特点：

- 轻量级：相比进程，线程的开销更小，创建、销毁和切换的速度更快。

- 共享资源：多个线程可以共享进程的资源和内存空间，包括代码、数据、堆栈等。

- 并发性：多个线程可以并发执行，从而提高计算机的效率和性能。

- 随机性：线程的执行顺序和时间是不确定的，取决于系统的调度算法和各个线程的优先级。

- 同步问题：由于多个线程共享同一份数据，因此需要注意同步问题，避免数据竞争和死锁等问题。

线程通常用于实现并发编程，可以同时执行多个任务，提高程序的效率和性能。在多线程编程中，需要注意线程的安全性和同步问题，使用锁、信号量等机制来保证线程的正确性和可靠性。

## 进程与线程关系

<img src="img/process&thread.jpg" alt="进程和线程" width="400" />

1. 线程是依附于进程的，而进程中使用多线程并行处理能提升运算效率。
2. 进程中的任意一线程执行出错，都会导致整个进程的崩溃
3. 线程之间共享进程中的数据。

## IPC(inter-process communication) 进程间通信

todo
<!-- http://c.biancheng.net/view/1208.html -->

## 浏览器进程

打开一个浏览器tab页面将会开启一个浏览器进程、GPU进程、network service、Storage service、Audio service等等...

<img src="img/%E6%B5%8F%E8%A7%88%E5%99%A8%E8%BF%9B%E7%A8%8B%E6%88%AA%E5%9B%BE.png" alt="浏览器 管理" width="400" >

- 浏览器进程：主要负责界面显示、用户交互、子进程管理，同时提供存储等功能。
- 渲染进程：核心任务是将 HTML、CSS 和 JavaScript 转换为用户可以与之交互的网页，排版引擎 Blink 和 JavaScript 引擎 V8 都是运行在该进程中，默认情况下，Chrome 会为每个 Tab 标签创建一个渲染进程。出于安全考虑，渲染进程都是运行在沙箱模式下。渲染进程启动后，会开启⼀个渲染主线程，主线程负责执⾏ HTML、CSS、JS 代码。

- GPU 进程：其实，Chrome 刚开始发布的时候是没有 GPU 进程的。而 GPU 的使用初衷是为了实现 3D CSS 的效果，只是随后网页、Chrome 的 UI 界面都选择采用 GPU 来绘制，这使得 GPU 成为浏览器普遍的需求。最后，Chrome 在其多进程架构上也引入了 GPU 进程。
- 网络进程：主要负责页面的网络资源加载，之前是作为一个模块运行在浏览器进程里面的，直至最近才独立出来，成为一个单独的进程。
- 插件进程：主要是负责插件的运行，因插件易崩溃，所以需要通过插件进程来隔离，以保证插件进程崩溃不会对浏览器和页面造成影响。


## 渲染主线程

渲染主线程是浏览器中最繁忙的线程，需要它处理的任务包括但不限于：
- 解析 HTML
- 解析 CSS
- 计算样式
- 布局
- 处理图层
- 每秒把⻚⾯画 60 次
- 执⾏全局 JS 代码
- 执⾏事件处理函数
- 执⾏计时器的回调函数


### meesageloop

渲染主线程需要做这么多事情 如何控制事件的顺序呢 --> 排队

<img src="img/msgloop.jpg" alt="msgloop" width="600" />

  1. 在最开始的时候，渲染主线程会进⼊⼀个⽆限循环
  2. 每⼀次循环会检查消息队列中是否有任务存在。如果有，就取出第⼀个任务执⾏，执⾏完⼀个后进⼊下⼀次循环；如果没有，则进⼊休眠状态。
  3. 其他所有线程（包括其他进程的线程）可以随时向消息队列添加任务。新任务会加到消息队列的末尾。在添加新任务时，如果主线程是休眠状态，则会将其唤醒以继续循环拿取任务。
  这样⼀来，就可以让每个任务有条不紊的、持续的进⾏下去了。
  整个过程，被称之为**事件循环（消息循环）**


在代码处理的过程中，会遇到一些没有办法立即处理的任务，比如：

  - 计时完成后需要执⾏的任务 —— setTimeout 、 setInterval
  - ⽹络通信完成后需要执⾏的任务 -- XHR 、 Fetch
  - ⽤户操作后需要执⾏的任务 -- addEventListener

如果让渲染主线程等待这些任务的时机达到，就会导致主线程⻓期处于「阻塞」的状态，从⽽导致浏览器「卡死」

<img src="img/msgloop2.png" alt="msgloop" width="600" />

浏览器选择异步来解决这个问题,借助 message queue

<img src="img/msgloop3.png" alt="msgloop" width="600" />

任务是没有优先级的，在消息队列中 **先进先出**。但是消息队列是有**优先级**的。
根据 W3C 的最新解释:
- 每个任务都有⼀个任务类型，同⼀个类型的任务必须在⼀个队列，不同类型
的任务可以分属于不同的队列。
在⼀次事件循环中，浏览器可以根据实际情况从不同的队列中取出任务执
⾏。
- 浏览器必须准备好⼀个微队列，微队列中的任务优先所有其他任务执⾏。

在⽬前 chrome 的实现中，⾄少包含了下⾯的队列：
- 延时队列：⽤于存放计时器到达后的回调任务，优先级「中」
- 交互队列：⽤于存放⽤户操作后产⽣的事件处理任务，优先级「⾼」
- 微队列：⽤户存放需要最快执⾏的任务，优先级「最⾼」

## vue2 中 nexttick

Here we have async deferring wrappers using microtasks. 使用微任务的异步延迟包装器。

nexttick 利用任务队列中微任务优先级高的特点

1. 在 nexttick 中，首先会判断 环境是否支持 promise
```js
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks)
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) setTimeout(noop)
  }
  isUsingMicroTask = true
} 
```

2. 如果不支持，则判断是否支持 MutationObserver

```js
// MutationObserver is unreliable in IE11
else if (
  !isIE &&
  typeof MutationObserver !== 'undefined' &&
  (isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === '[object MutationObserverConstructor]')
) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  let counter = 1
  const observer = new MutationObserver(flushCallbacks)
  const textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
  }
  isUsingMicroTask = true
} 
```

3. 如果也不支持 MutationObserver 则采用 宏任务 setImmediate 兜底，先判断是否支持 setImmediategit

```JS
else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} 

```

4. 如果都不支持，最后是 setTimeout兜底

```js

timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
```


### vue3 中的 nexttick 

Vue 3 中的 nextTick 方法时，它会返回一个 Promise 对象。Vue 3 会在 Promise 的 then 方法中执行回调函数，而这个 then 方法会被加入到微任务队列中。当主线程中的任务执行完毕后，会立即执行微任务队列中的任务，这时就会执行 nextTick 的回调函数。

Vue 3 还会利用浏览器原生的 queueMicrotask 方法，将 nextTick 的回调函数放入微任务队列中。这样可以确保回调函数在 DOM 更新周期之后执行，但是在下一个事件循环之前执行。这样可以避免在同一个事件循环中执行太多的任务，从而提高性能。


### 相关文档

[MutationObserver mdn](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver)