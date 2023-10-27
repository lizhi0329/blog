- [vite打包后的文件提供传统浏览器兼容性支持](#vite打包后的文件提供传统浏览器兼容性支持)
  - [@vitejs/plugin-legacy 插件](#vitejsplugin-legacy-插件)
- [SystemJS](#systemjs)
- [crossorigin](#crossorigin)
- [script标签加载js的3个时机](#script标签加载js的3个时机)
  - [async](#async)
- [rel属性](#rel属性)
  - [preload 预加载](#preload-预加载)
  - [rel="prefetch"](#relprefetch)
  - [rel="dns-prefetch"](#reldns-prefetch)


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

![html解析script](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/caf2f618530046658ab8e3b4a8699589~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

而加上async 和 defer 会起到延迟作用：

- async： 当遇到async的script标签时，请求该脚本的网络请求是异步的，不会阻塞浏览器解析 HTML，一旦网络请求回来之后，如果此时 HTML 还没有解析完，浏览器会暂停解析，先让 JS 引擎执行代码，执行完毕后再进行解析。如果存在多个 async 的时候，它们之间的执行顺序也不确定，完全依赖于网络传输结果，谁先到执行谁。
- defer： 当浏览器遇到带有 defer 属性的 script 时，获取该脚本的网络请求也是异步的，不会阻塞浏览器解析 HTML，一旦网络请求回来之后，如果此时 HTML 还没有解析完，浏览器不会暂停解析并执行 JS 代码，而是等待 HTML 解析完毕,但在触发 DOMContentLoaded 事件之前执行的, 再执行 JS 代码。如果存在多个 defer script 标签，浏览器（IE9及以下除外）会保证它们按照在 HTML 中出现的**顺序执行**，不会破坏 JS 脚本之间的依赖关系。
包含 defer 属性的脚本将阻塞 DOMContentLoaded 事件触发，直到脚本完成加载并执行。

### async

## rel属性

<!-- 作用范围：crossorigin 属性作用在`link`、`a`、`area`有效。 -->

<!-- https://developer.mozilla.org/zh-CN/docs/Web/HTML/Attributes/rel -->

### preload 预加载

<link> 元素的 rel 属性的 preload 值允许你在 HTML 的 <head> 中声明获取请求，指定页面很快就需要的资源，这些资源是你希望在页面生命周期的早期就开始加载的，早于浏览器的主要渲染机制启动。这可以确保它们更早可用，并且不太可能阻塞页面的渲染，从而提高性能。尽管名称中包含“load”一词，但它并不加载和执行脚本，而只是安排脚本以更高的优先级进行下载和缓存。


<link rel="preload" href="main.js" as="script" />

什么类型的内容可以被预加载？

- audio：音频文件，通常在 <audio> 中使用。
- document：用于嵌入在 <frame> 或 <iframe> 中的 HTML 文档。
- embed：用于嵌入在 <embed> 元素中的资源。
- fetch：通过 fetch 或 XHR 请求访问的资源，例如 ArrayBuffer、WebAssembly 二进制文件或 JSON 文件。
- font：字体文件。
- image：图像文件。
- object：要嵌入在 <object> 元素中的资源。
- script：JavaScript 文件。
- style：CSS 样式表。
- track：WebVTT 文件。
- worker：JavaScript web worker 或 shared worker。
- video：视频文件，通常在 <video> 中使用。

### rel="prefetch"

- <link rel="prefetch"> 在浏览器中支持已久，但它是用于预取将在下一次导航/页面加载时使用的资源（例如，当你跳转到下一页时）。这是可以的，但对于当前页面没有用！此外，浏览器会给预取（prefetch）的资源比预加载（preload）的资源更低的优先级——当前页面比下一页更重要。有关更多详细信息，请参阅预取。
- <link rel="prerender"> 在后台渲染指定的网页，如果用户导航到该页面，可以加速其加载。由于有可能浪费用户的带宽，Chrome 将 prerender 视为 NoState 预取。
- <link rel="subresource"> 非标准 一段时间以前在 Chrome 中得到了支持，其目的是解决与 preload 相同的问题，但它存在一个问题：没有办法确定项目的优先级（as 当时还不存在），所以它们都是以相当低的优先级获取的。


### rel="dns-prefetch"

在 HTML 中，rel="dns-prefetch" 是 <link> 标签的一个属性，用于指定浏览器应该预解析指定的域名。预解析是指浏览器在需要访问一个域名时提前解析 DNS，以便更快地加载资源。通过使用 rel="dns-prefetch" 属性，您可以指定浏览器应该预解析哪些域名，以便更快地加载与这些域名相关联的资源。