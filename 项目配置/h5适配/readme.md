- [viewport](#viewport)
  - [viewport meta 标记](#viewport-meta-标记)
  - [rem适配方案](#rem适配方案)
  - [vh 、vw方案](#vh-vw方案)
- [一些问题](#一些问题)
  - [div和img之间有间隙的原因及解决办法](#div和img之间有间隙的原因及解决办法)


## viewport

定义: 在浏览器范畴里，它代表的是浏览器中网站可见内容的部分。视口外的内容在被滚动进来前都是不可见的。

视口当前可见的部分叫做`可视视口（visual viewport）`。可视视口可能会比`布局视口（layout viewport）`更小，因为当用户缩小浏览器缩放比例时，布局视口不变，而可视视口变小了。

### viewport meta 标记

```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

可选属性：

- width: 控制视口的大小。这可以设置为特定像素数（如'width=600'），也可以设置为特殊值device-width，即 100vw，100% 的视口宽度。最小值为 1。最大值为 10000。负值会被忽略。
- height: 控制视口的大小。这可以设置为特定像素数（如 height=600），也可以设置为特殊值 device-height，即 100vh，100% 的视口高度。最小值为 1。最大值为 10000。负值会被忽略。
- initial-scale: 控制页面**首次**加载显示的缩放倍数。最小值是 0.1。最大值是 10。默认值为 1。负值会被忽略。
- minimum-scale: 控制页面允许缩小的倍数。最小值是 0.1。最大值是 10。默认值为 1。负值会被忽略。
- maximum-scale: 控制页面允许放大的倍数。设置一个低于 3 的值将不具备无障碍访问性。最小值是 0.1。最大值是 10。默认值为 1。负值会被忽略.
- user-scalable: 控制是否允许页面上的放大和缩小操作。有效值为 0、1、yes 或 no。默认值为 1，与 yes 相同。将值设置为 0（即与 no 相同）将违反 Web 内容无障碍指南（WCAG）。
- interactive-widget: 指定交互式 UI 组件（如虚拟键盘）对页面视口的影响。有效值：resizes-visual、resizes-content 或 overlays-content。默认值：resizes-visual。


### rem适配方案

rem（font size of the root element）是指相对于根元素的字体大小的单位，
如果我们设置 html 的 font-size 为 16px，则如果需要设置元素字体大小为 16px，则写为 1rem。

### vh 、vw方案



## 一些问题

### div和img之间有间隙的原因及解决办法

原因：由于img标签是行内标签，display:inline-block布局的元素在chrome下会出现几像素的间隙，原因是因为我们在编辑器里写代码的时候，同级别的标签不写在同一行以保持代码的整齐可读性，即inline-block布局的元素在编辑器里不在同一行，即存在换行符，因此这就是著名的inline-block“换行符/空格间隙问题”。

解决方法：

1. 把img标签的display属性改成block

   ```css
      img{ display:block; }
   ```

2. 修改img的vertical-align属性

```css
img{vertical-align:buttom;}
img{vertical-align:middle;}
img{vertical-align:top;}
```