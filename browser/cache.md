# cache

## 常用缓存方案

    强缓存与协商缓存相结合的方案:

    1）HTML 文档配置协商缓存；

    2）JS、CSS、图片等资源配置强缓存

<!-- ## 强缓存

> 如果资源未过期 则取缓存，如果过期，则请求服务器，一般用于图片、js、css 等资源。 -->

### `Cache-Control`

> Cache-Control 通用消息头字段，被用于在 http 请求和响应中，通过指定指令来实现缓存机制。缓存指令是单向的，这意味着在请求中设置的指令，不一定被包含在响应中。

是 http1.1 中控制缓存的字段，主要取值：

#### 可缓存性

1. `public`

   表明响应可以被任何对象（包括：发送请求的客户端，代理服务器，等等）缓存，即使是通常不可缓存的内容。（例如：1.该响应没有 max-age 指令或 Expires 消息头；2. 该响应对应的请求方法是 POST 。）

2. `private`

   表明响应只能被单个用户缓存，不能作为共享缓存（即代理服务器不能缓存它）。私有缓存可以缓存响应内容，比如：对应用户的本地浏览器。

3. `no-cache`

   在发布缓存副本之前，强制要求缓存把请求提交给原始服务器进行验证 (协商缓存验证)。

4. `no-store`

   不使用任何缓存

### 到期

5. `max-age=<seconds>`

   设置缓存存储的最大周期，超过这个时间缓存被认为过期 (单位秒)。与 Expires 相反，时间是相对于请求的时间。

6. `s-maxage=<seconds>`
   覆盖 max-age 或者 Expires 头，但是仅适用于共享缓存 (比如各个代理)，私有缓存会忽略它。

### `Expires`

> 是 **HTTP1.0** 控制网页缓存的字段，值为一个时间戳，服务器返回该资源缓存的到期时间

缺点：
判断是否过期是用本地时间来判断的，本地时间是可以自己修改的。
到了 HTTP/1.1，Expire 已经被 Cache-Control 替代，Cache-Control 使用了 max-age 相对时间，解决了 Expires 的缺陷

**注意：当 Cache-Control 与 expires 两者都存在时，Cache-Control 优先级更高**

## 强缓存

通过 Cache-Control 或者 expires 判断是否为强缓存

## memory cache 与 disk cache 的区别？

两者都属于强缓存，主要区别在于存储位置和读取速度上

1）memory cache 表示缓存来自内存， disk cache 表示缓存来自硬盘

2）memory cache 要比 disk cache 快的多！从磁盘访问可能需要 5-20 毫秒，而内存访问只需要 100 纳秒甚至更快

- memory cache 特点：当前 tab 页关闭后，数据将不存在（资源被释放掉了），再次打开相同的页面时，原来的 memory cache 会变成 disk cache

- disk cache 特点：关闭 tab 页甚至关闭浏览器后，数据依然存在，下次打开仍然会是 from disk cache

一般情况下，浏览器会将 js 和图片等文件解析执行后直接存入内存中，这样当刷新页面时，只需直接从内存中读取(from memory cache)；
而 css 文件则会存入硬盘文件中，所以每次渲染页面都需要从硬盘读取缓存(from disk cache)

## 协商缓存

浏览器携带缓存标识向服务器发送请求，服务器根据缓存标识来决定该资源是否过期，一般用于 html 资源，验证版本是否更新

### 触发条件

Cache-Control 的值为 no-cache （协商缓存）
或者 Cache-Control: max-age=0

### Last-Modified

Last-Modified：文件在服务器最后被修改的时间，从服务器 Respnse Headers 上获取

步骤：

1. 第一次请求接口时， 接口的响应头中 会携带 `last-modified: Thu, 16 Mar 2023 02:52:05 GMT`
2. 客户端再次发起该请求时，请求头 `If-Modified-Since` 字段会携带上次请求返回的 `Last-Modified` 值
3. 服务器根据 `if-modified-since` 的值，与该资源在服务器最后被修改时间做对比，若服务器上的时间大于 `Last-Modified` 的值，则重新返回资源，返回 200，表示资源已更新；反之则返回 304，代表资源未更新，可继续使用缓存.

### Etag

ETag：当前资源文件的一个唯一标识(由服务器生成)，若文件内容发生变化该值就会改变

步骤：

1. 第一次请求接口时，服务器的响应头会返回 `etag` 字段
2. 客户端再次发起该请求时，请求头 If-None-Match 字段会携带上次请求返回的 etag 值
3. 服务器根据 `If-None-Match` 的值，与该资源在服务器的 Etag 值做对比，若值发生变化，状态码为 200，表示资源已更新；反之则返回 304，代表资源无更新，可继续使用缓存

`Etag` 的出现主要是为了解决一些 `Last-Modified` 难处理的问题：
1）一些文件也许会周期性的更改，但是内容并不改变(仅仅改变的修改时间)，这时候并不希望客户端认为这个文件被修改了而重新去请求；
2）某些文件修改非常频繁，比如在秒以下的时间内进行修改，(比方说 1s 内修改了 N 次)，If-Modified-Since 能检查到的粒度是秒级的，使用 Etag 就能够保证这种需求下客户端在 1 秒内能刷新 N 次 cache
注意：Etag 优先级高于 Last-Modified，若 Etag 与 Last-Modified 两者同时存在，服务器优先校验 Etag
