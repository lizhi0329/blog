# margin重叠问题

## 产生margin重叠的条件

- 必须处于常规文档流（不能是浮动和定位）的块级盒子，并且处于同一个BFC当中。
- 没有线盒，没有空隙，没有padding和border将他们分割。
- 都处于垂直方向相邻的外边距。

## margin重叠分为：兄弟重叠、父子重叠

### 父子重叠 解决方法

1. 父元素设置边框
2. 子元素 不为块元素
3. 父亲设置bfc

### 兄弟元素 解决方法

1. 设置其中一个元素为BFC
2. 设置其中一个元素 不为块元素（CSS中的box无非就四种：float box，absolute positioned box，inline-level box， block-level box）
float box和absolute positioned box都会脱离正常流而自成一条流，流与流之间是各玩各的，互不干扰。而inline-level box在渲染过程中会参与inline formatting context，这个上下文中的box不会发生margin重叠。