- [vite打包后的文件提供传统浏览器兼容性支持](#vite打包后的文件提供传统浏览器兼容性支持)
  - [@vitejs/plugin-legacy 插件](#vitejsplugin-legacy-插件)
- [SystemJS](#systemjs)
- [crossorigin](#crossorigin)
- [script标签加载js的3个时机](#script标签加载js的3个时机)
  - [async](#async)
- [rel属性](#rel属性)


## vite打包后的文件提供传统浏览器兼容性支持

###  @vitejs/plugin-legacy 插件

vite默认的浏览器支持基线是`原生ESM`、`原生ESM动态导入`和`import.meta`。这个插件为在生产环境中构建时不支持这些特性的旧浏览器提供支持。

次插件：

    - 为最终捆绑包中的每个块生成相应的旧块，并通过 @babel/preset-env进行了转换，并作为systemjs模块发射（仍然支持代码拆分！）。
    - 生成一个包含SystemJS运行时的polyfill块，以及由指定的浏览器目标和bundle中的实际使用情况决定的任何必要的polyfill块。
    - 在生成的HTML中注入<script nomodule>标签，以有条件地加载polyfills和遗留包，仅在没有广泛可用的特性支持的浏览器中加载
    - 注入import.meta.env.LEGACY env变量，该变量仅在遗留产品构建中为真，在所有其他情况下为假。

    
采用 `@vitejs/plugin-legacy` 插件打包后会生成带有 `legacy`标识的js产物。Vite会为当前每个文件都生成一个legacy文件，legacy文件中是通过`babel转化`后的兼容代码，所以Vite做兼容的本质还是通过babel实现的。

1. 打包后的index.html如何知道该加载哪些文件呢？

可以看到打包后的index.html中有 script `type="modlue"`和`nomodules`属性。

```html
    <script type="module" crossorigin src="/assets/index-9febca03.js"></script>
    <script
      nomodule
      crossorigin
      id="vite-legacy-polyfill"
      src="/assets/polyfills-legacy-8738710c.js"
    ></script>
```

`type="module"` 特性：

- 在支持模块化的浏览器中，该script代码会被当做JavaScript模块进行解析。
- 在不支持模块化的浏览器中，该script代码会被当做数据块而不会被解析.
- 代码报错只会阻塞当前模块的后续逻辑，不会阻塞模块外的逻辑和页面渲染


`nomodule` 特性：
- 这个布尔属性被设置来标明这个脚本不应该在支持 ES 模块的浏览器中执行。实际上，这可用于在不支持模块化 JavaScript 的旧浏览器中提供回退脚本。


index.html解析在支持模块化中会解析到这么一段：

```html
    <script type="module">
      import.meta.url // 判断环境是否支持 import.meta
      import('_').catch(() => 1) // 判断是否支持 import
      async function* g() {} // 判断是否支持aysnc
      // 如果都支持则将 __vite_is_modern_browser 设置为true 如果不支持则会报错 __vite_is_modern_browser就为undefined
      if (location.protocol != 'file:') {
        window.__vite_is_modern_browser = true
      }
    </script>
```

这一步就是判断浏览器是否比较新，接下来：
1. 如果不是新的则动态创建script 加载一遍 id="vite-legacy-polyfill" 的script标签。
2. 当 vite-legacy-polyfill 的script加载完后就会 通过`SystemJS`将入口兼容的入口文件加载过来。

```html
    <script type="module">
      !(function () {
        if (window.__vite_is_modern_browser) return
        console.warn(
          'vite: loading legacy chunks, syntax error above and the same error below should be ignored'
        )
        var e = document.getElementById('vite-legacy-polyfill'),
          n = document.createElement('script')
        ;(n.src = e.src),
          (n.onload = function () {
            System.import(
              document
                .getElementById('vite-legacy-entry')
                .getAttribute('data-src')
            )
          }),
          document.body.appendChild(n)
      })()
    </script>
```

也就是当如果当钱浏览器支持type=“modelue”情况下：
1. 当前浏览器为现在浏览器 直接继续加载接下来的script type="module"标签
2. 如果不支持最新的语法，则会加载兼容代码。但是入口文件会加载两次，一次是兼容了的代码一次是没有，而在没有兼容了的代码中也能看到这么一段：
   
```js
function __vite_legacy_guard() {
  import.meta.url;
  import("_").catch(() => 1);
  async function* g() {
  }
  ;
}

```


还有一种情况就是完全不支持 type=“modelue”，则会加载 `nomodule` 标签的代码：

```html
    <script nomodule>
      !(function () {
        var e = document,
          t = e.createElement('script')
        if (!('noModule' in t) && 'onbeforeload' in t) {
          var n = !1
          e.addEventListener(
            'beforeload',
            function (e) {
              if (e.target === t) n = !0
              else if (!e.target.hasAttribute('nomodule') || !n) return
              e.preventDefault()
            },
            !0
          ),
            (t.type = 'module'),
            (t.src = '.'),
            e.head.appendChild(t),
            t.remove()
        }
      })()
    </script>
    <script
      nomodule
      crossorigin
      id="vite-legacy-polyfill"
      src="/assets/polyfills-legacy-8738710c.js"
    ></script>
    <script
      nomodule
      crossorigin
      id="vite-legacy-entry"
      data-src="/assets/index-legacy-476bea5f.js"
    >
      System.import(
        document.getElementById('vite-legacy-entry').getAttribute('data-src')
      )
    </script>

```




## SystemJS

SystemJS 是一个 JavaScript 模块加载器，可以在浏览器端和服务器端加载 CommonJS、AMD、ES6 模块等多种格式的模块。它允许开发者在浏览器端使用模块化的方式开发应用程序，同时也支持加载在服务器端运行的 Node.js 模块。

SystemJS 的主要特点包括：

- 支持多种模块格式：可以加载 CommonJS、AMD、ES6 模块等多种格式的模块。
- 支持动态加载：可以在运行时动态加载模块，而不需要在编译时确定模块依赖关系。
- 可扩展性强：可以通过插件系统扩展 SystemJS 的功能，例如添加新的模块格式、实现模块转换等。
- 跨域支持：支持加载跨域模块，可以通过配置 CORS 响应头来实现跨域加载。

```js
<script src="system.js"></script>
<script>
  System.import('my-module.js').then(function(module) {
    // 加载成功后的处理逻辑
  }).catch(function(error) {
    // 加载失败后的处理逻辑
  });
</script>

```

## crossorigin

作用：定义该元素如何处理跨源请求，从而实现对该元素获取数据的 CORS 请求的配置

作用范围：crossorigin 属性作用在`audio`、`video`、`script`、`link`、`img`有效。

参数可选值：

- anonymous： 请求使用了 CORS 标头，且证书标志被设置为 'same-origin'。
没有通过 cookies、客户端 SSL 证书或 HTTP 认证交换用户凭据，除非目的地是同一来源。不合法的关键字或空字符串会视为 anonymous 关键字。
可以访问JavaScript的错误上下文，但在请求过程中的SSL握手阶段不会携带cookies或其他用户凭据。

- use-credentials：请求使用了 CORS 标头，且证书标志被设置为 'include'。总是包含`用户凭据`。
既可以访问JavaScript的错误上下文，也可以在请求过程中的SSL握手阶段时携带cookies或用户凭据。

- "": 将属性名称设置为空值，如 crossorigin 或 crossorigin=""，与设置为 anonymous 的效果一样。


## script标签加载js的3个时机

正常情况下 html 遇到 script标签会停下渲染加载script标签。 多个script标签 会按顺序执行（尽管先遇到的可能响应时间更长），也就是说最终执行顺序和请求顺序一致。

而加上async 和 defer 会起到延迟作用：

### async

## rel属性

作用范围：crossorigin 属性作用在`link`、`a`、`area`有效。

<!-- https://developer.mozilla.org/zh-CN/docs/Web/HTML/Attributes/rel -->