## 关于 ajax

    AJAX（Asynchronous JavaScript and XML）指的是一种用于创建异步 Web 应用程序的技术。它可以在不重新加载整个页面的情况下向服务器发送请求、接收响应并更新页面的部分内容。在 AJAX 中，浏览器通过 JavaScript 发送 HTTP 请求到服务器，服务器处理请求并将响应以 XML、JSON 或其他格式返回给浏览器，然后浏览器使用 JavaScript 解析响应并更新网页中的内容。

    AJAX 技术的优点在于它能够提高 Web 应用程序的交互性和响应速度，同时减少了对服务器的负载和带宽的消耗。它使得 Web 应用程序可以在后台向服务器发送请求和接收响应，而不会打断用户的操作和页面的加载。此外，AJAX 还可以与其他 Web 技术（如 HTML、CSS、JavaScript）结合使用，从而实现更加复杂的 Web 应用程序。

    实际上，现代 Web 应用程序中大量使用了 AJAX 技术，例如 Google Maps、Gmail、Facebook 等。同时，随着 Web 技术的不断发展，也涌现出了许多基于 AJAX 的前端框架和库，如 jQuery、React、Vue.js 等，使得开发者可以更加方便地使用 AJAX 技术来开发 Web 应用程序。

    异步JavaScript和XML或Ajax本身不是一种技术，而是一种将许多现有技术一起使用的方法，包括HTML或XHTML，CSS，CSS，JavaScript，DOM，DOM，XML，XML，XSLT，以及最重要的是XMLHTTTPRequeSt对象。当将这些技术合并到AJAX模型中时，Web应用程序可以在不重新加载整个浏览器页面的情况下快速，增量更新用户界面。这使应用程序更快，对用户操作更快。

    概述：从客户端脚本加载服务器数据而不触发整个页面刷新的方法。

## xhr、fetch 和 ajax 的关系

    可以使用 XMLHttpRequest (XHR) 或 Fetch API 来实现 AJAX。

    XHR 是 AJAX 技术的一种实现方式，是早期实现 AJAX 的主要方式。而 Fetch API 是 ES6 新增的一种 API，提供了更加简洁和灵活的方式来实现 AJAX，可以看作是对 XHR 的一种优化和替代。无论是 XHR 还是 Fetch 都可以实现 AJAX 技术，开发者可以根据具体的需求和项目情况选择使用哪种方式。

## XMLHttpRequest

## fetch

### 语法

    Promise<Response> fetch(input[, init]);

### 返回值

    一个 Promise，resolve 时回传 Response 对象。

    注意：使用 Fetch API 进行网络请求时，第一个 then 方法通常用于处理 Response 对象。该 then 方法会在网络请求成功后被调用，并将一个包含响应数据的 Response 对象作为参数传递给回调函数。可以使用该对象的方法和属性来获取响应的状态码、headers、body 等信息。第一个 then 方法返回的 Response 对象中的 body 属性是一个只读的 ReadableStream 对象，该对象在请求返回后立即可用，但并不会立即包含完整的响应数据。相反，它会在流被逐步读取时逐步填充数据。
    这意味着，当第一个 then 方法返回时，body 中的数据可能只是响应数据的一部分，而不是完整的数据。具体取决于响应数据的大小和网络连接的速度。如果要读取完整的响应数据，需要持续读取 body 直到数据被完全填充。

### ex

```js
fetch(
  "https://hardware-pad-editor-test.youdao.com/v1/api/selfCourse/getSpecificUserReport?pageNum=1&pageSize=20"
)
  .then(function (response) {
    console.log(response, "response");
    // response.body 数据可能只是响应数据的一部分，而不是完整的数据。具体取决于响应数据的大小和网络连接的速度。如果要读取完整的响应数据，需要持续读取 body 直到数据被完全填充。
    return response.json();
  })
  .then(function (result) {
    console.log(result, "response");
  });
```

## 优缺点

### fetch

1. 支持 Promise API，使用更加方便
2. 提供了更好的流控制，支持基于流的响应处理
3. 更好的操作 request（可以传递一个可配置Request对象） 和 response（Response对象提供对响应的所有详细信息的类似访问）
4. 缓存控制： 过设置 cache属性
  - cache可以设置为：
      - "default"：默认缓存策略，遵循 HTTP 缓存规则
      - "no-store"：禁用缓存，每次都重新请求
      - 'reload'- 禁用缓存，但是如果缓存没有过期，则使用缓存
      - 'no-cache'- 强制进行缓存验证，如果缓存过期了，则重新请求
      - 'force-cache'- 如优先使用缓存，即使缓存过期了也不会重新请求
      - 'only-if-cached'：仅从缓存中获取，如果缓存不存在，则返回一个错误
5. 更好的cookie控制：
- credentials可以设置为：
  - 'omit'- 不携带任何身份验证信息，即不设置 Cookie、Authorization 等头部。
  - 'same-origin'- 仅在同源请求中携带身份验证信息，不会跨域携带。
  - 'include'- 在所有请求中都携带身份验证信息，包括跨域请求。
6. 重定向控制
## 参考 

[Ajax Battle: XMLHttpRequest Vs The Fetch API](https://blog.openreplay.com/ajax-battle-xmlhttprequest-vs-fetch/)
