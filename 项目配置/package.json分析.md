## browserslist

  [browserslist github](https://github.com/browserslist/browserslist)

  是一个用于指定项目所支持的浏览器版本范围的配置项。该配置项通常用于自动化工具
  （Babel、Autoprefixer，postcss-preset-env 等插件）来根据项目的浏览器兼容性要求来自动处理代码，例如自动添加 CSS 前缀、转换 ES6 代码等。

  当你在package.json中添加以下内容时，所有工具都会自动找到目标浏览器：

  ```json
  // browserslist 配置的值可以是一个字符串、一个数组或一个对象，用于指定浏览器版本的范围
  {
    "name": "my-project",
    "version": "1.0.0",
    "browserslist": [
      "> 1%", // 表示全球使用率超过 1% 的所有浏览器。
      "last 2 versions", // 表示最近两个版本的所有浏览器。
      "ie >= 11" // 表示 IE11 及以上版本的浏览器。
    ],
    "devDependencies": {
      "autoprefixer": "^10.4.0",
      "babel": "^7.16.0"
    }
  }

  ```