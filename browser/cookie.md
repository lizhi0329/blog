# cookie

HTTP Cookie（也叫 Web Cookie 或浏览器 Cookie）是服务器发送到用户浏览器并保存在本地的一小块数据。浏览器会存储 cookie 并在下次向同一服务器再发起请求时携带并发送到服务器上。通常，它用于告知服务端两个请求是否来自同一浏览器——如保持用户的登录状态。Cookie 使基于无状态的 HTTP 协议记录稳定的状态信息成为了可能。

## set-cookie

> 响应标头 Set-Cookie 被用来由服务器端向用户代理发送 cookie，所以用户代理可在后续的请求中将其发送回服务器。
> 服务器要发送多个 cookie，则应该在同一响应中发送多个 Set-Cookie 标头。

### 语法

```
Set-Cookie: <cookie-name>=<cookie-value>
Set-Cookie: <cookie-name>=<cookie-value>; Expires=<date>
Set-Cookie: <cookie-name>=<cookie-value>; Max-Age=<number>
Set-Cookie: <cookie-name>=<cookie-value>; Domain=<domain-value>
Set-Cookie: <cookie-name>=<cookie-value>; Path=<path-value>
Set-Cookie: <cookie-name>=<cookie-value>; Secure
Set-Cookie: <cookie-name>=<cookie-value>; HttpOnly

Set-Cookie: <cookie-name>=<cookie-value>; SameSite=Strict
Set-Cookie: <cookie-name>=<cookie-value>; SameSite=Lax
Set-Cookie: <cookie-name>=<cookie-value>; SameSite=None; Secure

// Multiple attributes are also possible, for example:
Set-Cookie: <cookie-name>=<cookie-value>; Domain=<domain-value>; Secure; HttpOnly
```

### 可选参数

- <cookie-name>=<cookie-value>

- **Expires=<date>**

  cookie 的最长有效时间，形式为符合 HTTP-date 规范的时间戳。如果设置了 Expires 属性，其截止时间与客户端相关，而非服务器的时间。

- Max-Age=<number>
  在 cookie 失效之前需要经过的秒数。秒数为 0 或 -1 将会使 cookie 直接过期。假如 Expires 和 Max-Age 属性均存在，那么 Max-Age 的优先级更高。

- Domain=<domain-value>
  指定 cookie 可以送达的主机名。
  假如没有指定，那么默认值为当前文档访问地址中的主机部分（但是不包含子域名）。 与之前的规范不同的是，域名（.example.com）之前的点号会被忽略。
  多个主机/域名的值是不被允许的，但如果指定了一个域，则其子域也会被包含。

- Path=<path-value>
  指定一个 URL 路径，这个路径必须出现在要请求的资源的路径中才可以发送 Cookie 标头。
  字符 / 可以解释为文件目录分隔符，此目录的下级目录也满足匹配的条件（例如，如果 path=/docs，那么：

  - /docs、/docs/、/docs/Web/ 和 /docs/Web/HTTP 都满足匹配条件。
  - /、/docsets 或者 /fr/docs 则不满足匹配条件。

- SameSite=<samesite-value>

  允许服务器设定一则 cookie 不随着跨站请求一起发送，这样可以在一定程度上防范跨站请求伪造攻击（CSRF）。
  可选的属性值有：

  - `Strict`: 这意味浏览器仅对同一站点的请求发送 cookie，即请求来自设置 cookie 的站点。如果请求来自不同的域或协议（即使是相同域），则携带有 SameSite=Strict 属性的 cookie 将不会被发送。
  - `Lax`: 这意味着 cookie 不会在跨站请求中被发送，如：加载图像或 frame 的请求。但 cookie 在用户从外部站点导航到源站时，cookie 也将被发送（例如，跟随一个链接）。这是 SameSite 属性未被设置时的默认行为。
  - `None`: 这意味着浏览器会在跨站和同站请求中均发送 cookie。在设置这一属性值时，必须同时设置 Secure 属性，就像这样：SameSite=None; Secure。

- HttpOnly

用于阻止 JavaScript 通过 Document.cookie 属性访问 cookie。注意，设置了 HttpOnly 的 cookie 在 JavaScript 初始化的请求中仍然会被发送。
例如，调用 XMLHttpRequest.send() 或 fetch()。其用于防范跨站脚本攻击（XSS）。

### q&a

1. set-cookie 没有设置过期时间

如果 cookie 没有设置 过期时间，那么 cookie 将变为会话 cookie。会话 Cookie 将在用户关闭浏览器时被自动删除，即只存在于当前会话期间。

max-age 和 Expires 同时存在的时候，max-age 优先级大，且 max-age=0 或者-1 会使 cookie 直接过期

2. domain 可以设置为非服务器域名吗

在设置 Cookie 时，其 Domain 属性必须是 Cookie 所在服务器的域名或其子域名，不能是其他域名或 IP 地址。这是由于同源策略的限制所导致的。

同源策略是浏览器中的一项安全措施，它要求 Web 页面只能与其来源相同的资源进行交互，以防止恶意网站访问用户的敏感信息。如果 Cookie 的 Domain 属性设置为非服务器域名，那么该 Cookie 将违反同源策略，可能会导致安全问题。

需要注意的是，即使在同一个域名下，不同的子域名也被认为是不同的源，因此 Cookie 的 Domain 属性应该设置为 Cookie 所在服务器的域名或其子域名。例如，如果 Cookie 是由“www.example.com”服务器设置的，则其Domain属性可以设置为“www.example.com”或“example.com”，但不能设置为“otherdomain.com”或“192.168.0.1”。
