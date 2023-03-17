
* [eslint配置](#eslint配置)
  * [eslintrc.js结构分析](#结构分析)
* [prettier配置](#配置prettier)
* [配置当前项目的编辑器 todo]()
* [vite 配置 todo]()


# eslint配置

## 步骤

  1.  pnpm add eslint -D
  2.  pnpm init eslint

      按照提示选择配置：

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
        env: {
          browser: true,
          es2021: true,
        },
        extends: [
          "eslint:recommended",
          "plugin:vue/vue3-essential",
          "plugin:@typescript-eslint/recommended",
        ],
        overrides: [],
        parser: "@typescript-eslint/parser",
        parserOptions: {
          ecmaVersion: "latest",
          sourceType: "module",
        },
        plugins: ["vue", "@typescript-eslint"],
        rules: {},
      };
      ```

  3.  在 `eslintrc.js` 中在 env 字段中增加 node: true 配置以解决 eslint 找不到 module 的报错。

  4.  如果选择了`typescript` 则会碰到 解析错误问题，原因则是：

      - 按照.eslintrc.js 文件中的`extends`配置的顺序可知，最终导致报错的原因就是`@typescript-eslint/parser`把`vue-eslint-parser`覆盖了。
      - 查看`eslint-plugin-vue`官方文档可知。如果已经使用了另外的解析器（例如"parser": "@typescript-eslint/parser"），则需要将其移至 parseOptions，这样才不会与 vue-eslint-parser 冲突。

      更改后的 .eslintrc.js:

      ```js
      module.exports = {
        env: {
          browser: true,
          es2021: true,
          node: true,
        },
        extends: [
          "eslint:recommended",
          "plugin:vue/vue3-essential",
          "plugin:@typescript-eslint/recommended",
        ],
        overrides: [],
        parser: "vue-eslint-parser", // 用来解析.vue后缀文件
        parserOptions: {
          ecmaVersion: "latest",
          sourceType: "module",
          parser: "@typescript-eslint/parser",
        },
        plugins: ["vue", "@typescript-eslint"],
        rules: {},
      };
      ```

  两个 parser 的区别在于，外面的 parser 用来解析.vue 后缀文件，使得 eslint 能解析`<template>`标签中的内容，而`parserOptions`中的`parser`，即`@typescript-eslint/parser`用来解析 vue 文件中`<script>`标签中的代码。

  5. 配置 vscode 的自动格式化

  - 按照 eslint 插件
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
  - eslint-plugin-vue: 使用 ESLint 检查 .vue 文件 的 `<template>` 和` <script>`，以及.js 文件中的 Vue 代码。
  - @typescript-eslint/eslint-plugin: 一个 ESLint 插件，为 TypeScript 代码库提供 lint 规则。针对 ts 制定了一系列的 eslint 规则。
  - @typescript-eslint/parser: 解析 ts 代码

  ### 结构分析：

  ```js
  module.exports = {
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
    extends: [
      "eslint:recommended",
      "plugin:vue/vue3-essential",
      "plugin:@typescript-eslint/recommended",
    ],
    overrides: [],
    parser: "vue-eslint-parser", // 用来解析.vue后缀文件
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: "@typescript-eslint/parser",
    },
    plugins: ["vue", "@typescript-eslint"],
    rules: {},
  };
  ```

  1. `parser` 解析器

    ESLint 底层默认使用 ESpree 来进行 ast 解析，espree 是基于 acorn 实现的，虽然 acorn 解析的 ast 能解析绝大多数 ECMAscript 语法，
    但是 acorn 不能解析 ts 代码，所以 espree 也不能解析，因此要引入其他解析器。

    社区提供的解决方案是 @typescript-eslint/parser，

    这个解析器能将 ts 代码转换为 ESpree 能识别的格式（即 EStree 格式），然后在 ESLint 下进行格式检查，以此兼容了 typescript 语法。

  2. `parserOptions` 解析器选项

    - `ecmaVersion`: 这个配置和 Acron 的 ecmaVersion 是兼容的，可以配置 ES + 数字(如 ES6)或者 ES + 年份(如 ES2015)，也可以直接配置为 latest，启用最新的 ES 语法。

    - `sourceType`: 默认为 script，如果使用 ES Module 则应设置为 module

    - `ecmaFeatures`： 这是个对象，表示你想使用的额外的语言特性:
      - globalReturn - 允许在全局作用域下使用 return 语句
      - impliedStrict - 启用全局 strict mode (如果 ecmaVersion 是 5 或更高)
      - jsx - 启用 JSX
      - experimentalObjectRestSpread - 启用实验性的 object rest/spread properties 支持。(重要：这是一个实验性的功能,在未来可能会有明显改变。 建议你写的规则 不要 依赖该功能，除非当它发生改变时你愿意承担维护成本。)

  3. `rules` 具体规则

    在 rules 对象里，key 一般为规则名，value 为具体的配置内容。
    如果 value 配置为数组，第一个元素为规则的 ID，
    off - 0 关闭规则
    warn - 1 开启规则，违背规则抛出 warning，程序不会退出
    error - 2 开启规则，违背后抛出 error，程序退出

  4. `plugins`

    ESLint 本身没有内置 ts 的代码规则和 vue 代码规则，所以需要引入 帮助 eslint 扩展。

    添加插件后只是扩展了 ESLint 本身的规则集，但 ESLint 默认并没有开启这些规则的校验。

    要开启或者调整规则的校验，需要在 rules 里面配置。

  5. `extends` - 继承配置

    继承另一份 ESLint 配置，可以是字符串可以是字符串数组

    有了 extends 的配置，对于之前所说的 ESLint 插件中的繁多配置，我们就不需要手动在 rules 里一一开启了，通过 extends 字段即可自动开启继承插件中的规则。

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

  6. `env` 和 `globals`

    env 运行环境

    globals 是可以配置某个全局变量是否可以被修改

    配置值可以 3 种：

    "writable"或者 true，表示变量可重写；

    "readonly"或者 false，表示变量不可重写；

    "off"，表示禁用该全局变量。

  7. 其他

    - root: true, // 标识当前配置文件为 eslint 的根配置文件，让其停止在父级目录中继续寻找。

# 配置prettier

## 步骤

1. pnpm add prettier -D

2. 根目录下新建 .prettierrc.js

```js
module.exports = {
  // 一行的字符数，如果超过会进行换行，默认为80
  printWidth: 80,
  // 一个tab代表几个空格数，默认为80
  tabWidth: 2,
  // 是否使用tab进行缩进，默认为false，表示用空格进行缩减
  useTabs: false,
  // 字符串是否使用单引号，默认为false，使用双引号
  singleQuote: true,
  // 行位是否使用分号，默认为true
  semi: false,
  // 是否使用尾逗号，有三个可选值"<none|es5|all>"
  trailingComma: "none",
  // 对象大括号直接是否有空格，默认为true，效果：{ foo: bar }
  bracketSpacing: true,
};
```

3. 安装 vscode 插件 `Prettier - Code formatter`

在项目中的 .vscode 中 settings.json 加入

```js
{
    // 保存的时候自动格式化
    "editor.formatOnSave": true,
    // 默认格式化工具选择prettier
    "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

## 解决 eslint 与 prettier 的冲突

- eslint-plugin-prettier： 基于 prettier 代码风格的 eslint 规则，即 eslint 使用 pretter 规则来格式化代码。
- eslint-config-prettier： 禁用所有与格式相关的 eslint 规则，解决 prettier 与 eslint 规则冲突，确保将其放在 extends 队列最后，这样它将覆盖其他配置

```shell
pnpm add eslint-config-prettier eslint-plugin-prettier -D
```

```diff
{
    extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:@typescript-eslint/recommended',
+    // 新增，必须放在最后面
+    'plugin:prettier/recommended'
  ],
}
```
