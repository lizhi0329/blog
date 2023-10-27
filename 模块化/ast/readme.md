## AST 抽象语法树（Abstract Syntax Tree，AST）


https://astexplorer.net/

例如：

```js
function add(a, b) {
    return a + b;
}
function multiple(a, b) {
  let name = 'a'
    return a * b;
}
let firstNum = 3, secondNum = 4;
add(firstNum, secondNum);

```

转换成ast后就是 ./test.json

### AST的作用

- `代码分析与转换`: AST可以将我们的代码解析成一棵ast树，我们自然可以将这棵树进行处理和转换，这个最经典的应用莫过于babel了，将我们的高级语法ES6转换为ES5后，然后再把ast树转换成代码输出。除此之外，webpack的处理ES6的import和export也是依赖了ast的能力，以及我们的jsx的语法转换等。

- `语法检查和错误提示`: 我们把语法解析成ast树之后，自然就可以按照一定的语法规则去检查它的语法是否正确，一旦错误就可以抛出错误，提醒开发者去修正。比如我们使用的vscode就是利用AST 提供实时的语法检查和错误提示。而在前端项目中，应用的最广的语法检查工具就是ESlint了，基本就是前端项目必备。
- `静态类型检查`: 这个其实跟第二点有点像，不过第二点是侧重于语法检查，而这个是针对类型检查的，比如我们的Typescript会利用ast进行类型检查和推断。
- `代码重构`: 基于AST树，我们可以对代码进行自动重构。比如提取函数、变量重命名、语法升级、函数移动等。


### 代码编译过程

代码编译过程可以分为三步：

1. Parsing(解析过程)：这个过程需要进行词法分析、语法分析、构建AST（抽象语法树）一系列操作。
2. Transformation（转化过程）：这个过程就是将上一步解析后的内容，按照编译器指定的规则进行处理，形成一个新的表现形式；
3. Code Generation（代码生成）：将上一步处理好的内容转化为新的代码

![编译过程](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f90236f5c914a069bd51611b75160a7~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)


#### Parsing(解析)

解析过程分为2个步骤：词法分析、语法分析。

词法分析是使用tokenizer(分词器)或者lexer(词法分析器)，将源码拆分成tokens，tokens是一个放置对象的数组，其中的每一个对象都可以看做是一个单元（数字，标签，标点，操作符...）的描述信息。

语法解析则是将tokens重新整理成语法相互关联的表达形式 ，这种表达形式一般被称为中间层或者AST（抽象语法树）


### Transformation(转化)

这个过程主要是改写AST（抽象语法树），或者根据当前AST（抽象语法树）生成一个新的AST（抽象语法树），这个过程可以是相同语言，或者可以直接将AST（抽象语法树）翻译为其他语言。


<!-- https://juejin.cn/post/7155151377013047304?searchId=202310261803211FDC8F5641FB34127EF2 -->
<!-- https://juejin.cn/post/7265125368553685050?searchId=202310261803211FDC8F5641FB34127EF2#heading-2 -->