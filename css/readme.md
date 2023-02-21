# 一些稀碎的基础

## 继承属性

在css中，继承是指的是给父元素设置一些属性，后代元素会自动拥有这些属性

- 字体系列

```css
font:组合字体
font-family:规定元素的字体系列
font-weight:设置字体的粗细
font-size:设置字体的尺寸
font-style:定义字体的风格
font-variant:偏大或偏小的字体
```

- 文本属性

> 文本属性：vertical-align、text-decoration 不被继承

```css
text-indent：文本缩进
text-align：文本水平对刘
line-height：行高
word-spacing：增加或减少单词间的空白
letter-spacing：增加或减少字符间的空白
text-transform：控制文本大小写
direction：规定文本的书写方向
color：文本颜色
```

- 元素可见性

```css
visibility
```


- 表格布局属性

```css
caption-side：定位表格标题位置
border-collapse：合并表格边框
border-spacing：设置相邻单元格的边框间的距离
empty-cells：单元格的边框的出现与消失
table-layout：表格的宽度由什么决定
```

- 列表属性

```css
list-style-type：文字前面的小点点样式
list-style-position：小点点位置
list-style：以上的属性可通过这属性集合
```

- 引用

```css
quotes：设置嵌套引用的引号类型
```

- 光标属性

```css
cursor：箭头可以变成需要的形状
```

- [参考](https://juejin.cn/post/7107820079470870565#heading-2)

## 居中几种方式

### 水平居中

- 行内元素

```css
.parent {
    text-align: center;
}
```

- 块元素

```css
.son {
  margin: 0 auto;
  width: 300px;
}
```

- 子元素含 float

```css
.parent{
    width:fit-content;
    margin:0 auto;
}

.son {
    float: left;
}
```

- flex弹性盒子

- 绝对定位

1. transform

2. left/right: 0
```css
.son {
    position: absolute;
    width: 宽度;
    left: 0;
    right: 0;
    margin: 0 auto;
}
```

### 垂直居中

- 行内元素

```css
.parent {
    height: 高度;
}

.son {
    line-height: 高度;
}
```
局限：单行文本，子元素line-height 为父元素的height值


- table

```css
.parent {
  display: table;
}
.son {
  display: table-cell;
  vertical-align: middle;
}
```

- flex布局

- 绝对定位

1. transform

2. top/bottom: 0; 