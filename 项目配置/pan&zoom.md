## 平移和缩放

## WheelEvent

`WheelEvent` 是浏览器原生提供的事件类型之一，用于监听鼠标滚轮事件。当用户滚动鼠标滚轮时，会触发一个 WheelEvent 事件。WheelEvent 包含一些有用的信息，比如滚轮滚动的距离、滚轮滚动的方向等。

- deltaX: 返回一个 double 值，该值表示滚轮的横向滚动量。
- deltaY: 返回一个 double 值，该值表示滚轮的纵向滚动量。
- deltaZ: 返回一个 double 值，该值表示滚轮的 z 轴方向上的滚动量。


- pageX: 相对于整个文档的 x（水平）坐标以像素为单位。这个属性将基于文档的边缘，考虑任何页面的水平方向上的滚动。举个例子，如果页面向右滚动 200px 并出现了滚动条，这部分在窗口之外，然后鼠标点击距离窗口左边 100px 的位置，pageX 所返回的值将是 300。
- pageY: 它返回触发事件的位置相对于整个 document 的 Y 坐标值


### 缩放

 
 监听 dom 的 `wheel` 事件：

 ```ts
  let camera = {
    zoom: 1, // 缩放比例
    point: [0, 0], // 初始坐标
  } 


  element.addEventListener("wheel", handleWheel)
  function handleWheel(e: WheelEvent) {
    e.preventDefault() // 阻止鼠标滚轮事件的默认行为，即滚动页面。这是因为事件监听器函数需要自定义处理鼠标滚轮事件，而不是让浏览器按默认方式处理。
    if (e.ctrlKey) { // 是只读属性，可返回一个布尔值，当 ctrl 键被按下，返回 true，否则返回 false。
      // deltaY 为负数则是放大
      const point = [e.pageX, e.pageY] // 点击的坐标
      const p0 = add(div(point, camera.zoom), camera.point)
      let minZoom = 0.5
      let maxZoom = 3
      const curZoom = camera.zoom - (e.deltaY / 100) * camera.zoom
      // 获取范围间的
      camera.zoom = Math.max(minZoom,  Math.min(curZoom, maxZoom))
      const p1 = add(div(point, camera.zoom), camera.point)

      camera.point = add(camera.point, sub(p1, p0))

      return
    }
  }

  function sub(A: number[], B: number[]) {
    return [A[0] - B[0], A[1] - B[1]]
  }

  function div(A: number[], n: number) {
    return [A[0] / n, A[1] / n]
  }

  function add(A: number[], B: number[]) {
    return [A[0] + B[0], A[1] + B[1]]
  }
 ```

1. 定义了一个包含zoom和point两个属性的camera对象，分别表示缩放比例和初始坐标。
2. 在元素上添加了一个wheel事件监听器handleWheel，用于处理鼠标滚轮事件。
3. 在handleWheel函数中，首先调用了e.preventDefault()来阻止鼠标滚轮事件的默认行为，即滚动页面。
4. 判断当前是否按下了ctrl键，如果是，则执行缩放和拖动的功能。
5. 获取鼠标点击的坐标point，然后将其转换为根据当前缩放比例计算出的坐标p0。
6. 定义了minZoom、maxZoom和curZoom三个变量，分别表示最小缩放比例、最大缩放比例和当前缩放比例。
7. 根据鼠标滚轮的方向和大小，计算出新的缩放比例camera.zoom。
8. 将鼠标点击的坐标point转换为根据新的缩放比例计算出的坐标p1，然后计算出偏移量sub(p1, p0)。
9. 更新camera.point的值，将其加上偏移量。
10. 定义了sub、div和add三个函数，分别用于计算两个向量的减法、将向量除以标量和将两个向量相加。


最后加上样式

```js
setAttribute(
      "transform",
      `scale(${zoom}) translate(${point[0]} ${point[1]})`
    )
```

 