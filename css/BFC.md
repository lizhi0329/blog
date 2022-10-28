# BFC

BFC - Block Formatting Context 块级格式化上下文 
BFC的定义，在官方文档到中是这么介绍的：一个BFC区域包含创建该上下文元素的所有子元素，但是不包括创建了新的BFC的子元素的内部元素，BFC是一块块独立的渲染区域，可以将BFC看成是元素的一种属性，拥有了这种属性的元素就会使他的子元素与世隔绝，不会影响到外部其他元素

### 怎样使一个元素变成BFC区域

- 设置浮动，不包括none
- position的值为absolute或fixed
- 设置overflow，即hidden，auto，scroll
- display的值为inline-block、table-cell、table-caption

### 可解决的问题

- margin重叠
- 清除浮动导致父元素高度塌陷


- [](https://github.com/zuopf769/notebook/blob/master/fe/BFC%E5%8E%9F%E7%90%86%E5%89%96%E6%9E%90/README.md)
