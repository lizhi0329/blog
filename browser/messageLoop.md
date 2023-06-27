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

3. 如果也不支持 MutationObserver 则采用 宏任务 setImmediate 兜底，先判断是否支持 setImmediate

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