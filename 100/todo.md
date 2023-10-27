## 随机数

```js
function random(max = 100, min = 0) {
  return Math.floor(Math.random() * max + min) // 0 ~ 100
}

```

## 随机字符串

```js
// 生成长度12的随机字符串
function randomStr(length = 12) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ''

  for(let i = 0; i < length; i++) {
    result += characters.charAt(random(characters.length, 0))
  }
}
```


## vue中的data-v-xxx 的生成

style中的scoped是如何算的:

开发环境下：根据相对路径生成hash
生产环境下：相对路径 + 文件内容

- webpack + vue-loader 对 vue2 的处理

```js
  const shortFilePath = path
    .relative(rootContext || process.cwd(), filename)
    .replace(/^(..[/])+/, '').replace(//g, '/')
  
  const id = hash(
    isProduction
      ? shortFilePath + '\n' + source.replace(/\r\n/g, '\n')
      : shortFilePath
  )

```


- vite + @vitejs/plugin-vue 对 vue3 的处理


```js
import path from "node:path";
import { createHash } from "node:crypto";
import slash from "slash";

function getHash(text) {
  return createHash("sha256").update(text).digest("hex").substring(0, 8);
}

// 获取文件相对路径
const normalizedPath = slash(path.normalize(path.relative(root, filename)));
// 计算 ID
descriptor.id = getHash(normalizedPath + (isProduction ? source : ""));

```


