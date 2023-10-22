## 查看实际应用的编译选项或者包含的文件

npx tsc -p tsconfig.src.json --showConfig


## ts 模块查找 与 vite 模块解析 一致

```
// tsconfig.base.json
{
  "compilerOptions": {
    // ...
    "paths": {
      "@mrx/*": ["packages/*/src"]
    }
  }
}

```

```js
// vite.config.ts
resolve: {
    alias: [
      {
        find: /^@mrx\/(.+)$/, 
        replacement: join(__dirname, '..', 'packages', '$1', 'src') 
      },
    ]
  }

// 用于匹配字符串中以 @mrx/ 开头的部分，并捕获后续的字符串作为第一个捕获组。映射到项目中相应的包路径下。
// 例如 @mrx/hooks ===> ../packages/hooks/src
```


## 生成 d.ts 类型声明产物

使用 vue-tsc 生成

1. 
// 多文件生成
npx vue-tsc -p tsconfig.src.json --composite false --declaration --emitDeclarationOnly

// 单文件
vue-tsc --noEmit false --emitDeclarationOnly --declaration --outDir dist src/main.ts

2. scirpt脚本文件。通过 child_process  生成

