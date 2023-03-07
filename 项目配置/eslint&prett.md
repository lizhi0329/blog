# eslint 配置

## 步骤
1. pnpm add eslint -D
2. pnpm init eslint 

按照提示选择配置：
![步骤](https://ydhardwarecommon.nosdn.127.net/f8238b930d12030349014c32510ae6d6.jpg)

```bash
✔ How would you like to use ESLint? · problems
✔ What type of modules does your project use? · esm
✔ Which framework does your project use? · vue
✔ Does your project use TypeScript? · No / Yes
✔ Where does your code run? · browser
✔ What format do you want your config file to be in? · JavaScript
The config that you've selected requires the following dependencies:

eslint-plugin-vue@latest @typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest
✔ Would you like to install them now? · No / Yes
✔ Which package manager do you want to use? · pnpm
```

完成后会生成 `.eslintrc.js` 文件：

```js
module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/vue3-essential",
        "plugin:@typescript-eslint/recommended"
    ],
    "overrides": [
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "vue",
        "@typescript-eslint"
    ],
    "rules": {
    }
}

```

3. 在 `eslintrc.js` 中在env字段中增加node: true配置以解决eslint找不到module的报错。

4. 如果选择了`typescript` 则会碰到 解析错误问题，原因则是：
  - 按照.eslintrc.js文件中的`extends`配置的顺序可知，最终导致报错的原因就是`@typescript-eslint/parser`把`vue-eslint-parser`覆盖了。
  - 查看`eslint-plugin-vue`官方文档可知。如果已经使用了另外的解析器（例如"parser": "@typescript-eslint/parser"），则需要将其移至parseOptions，这样才不会与vue-eslint-parser冲突。

更改后的 .eslintrc.js:

```js
module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/vue3-essential",
        "plugin:@typescript-eslint/recommended"
    ],
    "overrides": [
    ],
    "parser": "vue-eslint-parser", // 用来解析.vue后缀文件
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "parser": "@typescript-eslint/parser"
    },
    "plugins": [
        "vue",
        "@typescript-eslint"
    ],
    "rules": {
    }
}
```

两个parser的区别在于，外面的parser用来解析.vue后缀文件，使得eslint能解析`<template>`标签中的内容，而`parserOptions`中的`parser`，即`@typescript-eslint/parser`用来解析vue文件中`<script>`标签中的代码。

5. 配置 vscode 的自动格式化
  - 按照eslint插件
  - 配置 vscode 的 setting.json, 加入保存自动格式化代码。
    ```json
    {
        // 开启自动修复
        "editor.codeActionsOnSave": {
            "source.fixAll": false,
            "source.fixAll.eslint": true
        }
    }
    ```

## 总结

### 依赖分析：

- eslint: JavaScript 和 JSX 检查工具.
- eslint-plugin-vue: 使用 ESLint 检查 .vue文件 的 `<template>` 和` <script>`，以及.js文件中的Vue代码。
- @typescript-eslint/eslint-plugin:  一个ESLint插件，为TypeScript代码库提供lint规则。针对ts制定了一系列的eslint规则。
- @typescript-eslint/parser: 解析 ts 代码

### 结构分析：

```js
module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/vue3-essential",
        "plugin:@typescript-eslint/recommended"
    ],
    "overrides": [
    ],
    "parser": "vue-eslint-parser", // 用来解析.vue后缀文件
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "parser": "@typescript-eslint/parser"
    },
    "plugins": [
        "vue",
        "@typescript-eslint"
    ],
    "rules": {
    }
}
```

1. parser 解析器

    ESLint底层默认使用ESpree来进行ast解析，espree是基于acorn实现的，虽然acorn解析的ast能解析绝大多数ECMAscript语法，
    但是acorn不能解析ts代码，所以espree也不能解析，因此要引入其他解析器。

    社区提供的解决方案是 @typescript-eslint/parser，

    这个解析器能将ts代码转换为ESpree能识别的格式（即EStree格式），然后在ESLint下进行格式检查，以此兼容了typescript语法。


2. parserOptions 解析器选项

    - ecmaVersion: 这个配置和 Acron 的 ecmaVersion 是兼容的，可以配置 ES + 数字(如 ES6)或者ES + 年份(如 ES2015)，也可以直接配置为latest，启用最新的 ES 语法。

    - sourceType: 默认为script，如果使用 ES Module 则应设置为module

    - ecmaFeatures： 这是个对象，表示你想使用的额外的语言特性:
      + globalReturn - 允许在全局作用域下使用 return 语句
      + impliedStrict - 启用全局 strict mode (如果 ecmaVersion 是 5 或更高)
      + jsx - 启用 JSX
      + experimentalObjectRestSpread - 启用实验性的 object rest/spread properties 支持。(重要：这是一个实验性的功能,在未来可能会有明显改变。 建议你写的规则 不要 依赖该功能，除非当它发生改变时你愿意承担维护成本。)

3. rules 具体规则

    在rules对象里，key一般为规则名，value为具体的配置内容。
    如果value配置为数组，第一个元素为规则的ID，
    off - 0 关闭规则
    warn - 1 开启规则，违背规则抛出warning，程序不会退出
    error - 2 开启规则，违背后抛出error，程序退出

4. plugins 

    ESLint本身没有内置ts的代码规则和vue代码规则，所以需要引入 帮助eslint扩展。

    添加插件后只是扩展了ESLint本身的规则集，但ESLint默认并没有开启这些规则的校验。

    要开启或者调整规则的校验，需要在rules里面配置。

5. extends - 继承配置

    继承另一份ESLint配置，可以是字符串可以是字符串数组

    有了 extends 的配置，对于之前所说的 ESLint 插件中的繁多配置，我们就不需要手动在rules里一一开启了，通过 extends 字段即可自动开启继承插件中的规则。

    ```js
    module.exports = {
        "extends": [
            // 第1种情况
            "eslint:recommended",

            // 第2种情况，一般配置的时候可以省略 `eslint-config`

            "standard"

            // 第3种情况，可以省略包名中的 `eslint-plugin`

            // 格式一般为: `plugin:${pluginName}/${configName}`

            "plugin:vue/vue3-essential"
            "plugin:@typescript-eslint/recommended",

        ]
    }
    ```

6. env 和 globals

    env 运行环境

    globals是可以配置某个全局变量是否可以被修改

    配置值可以3种：

    "writable"或者 true，表示变量可重写；

    "readonly"或者false，表示变量不可重写；

    "off"，表示禁用该全局变量。

7. 其他

    - root: true, // 标识当前配置文件为eslint的根配置文件，让其停止在父级目录中继续寻找。

