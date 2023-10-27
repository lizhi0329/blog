- [采用pnpm 搭建 monorepo 模式](#采用pnpm-搭建-monorepo-模式)
  - [monorepo](#monorepo)
    - [multirepo 和 monorepo](#multirepo-和-monorepo)
  - [pnpm 搭建](#pnpm-搭建)


# 采用pnpm 搭建 monorepo 模式

## monorepo

一个仓库管理多个项目，有助于简化代码共享、版本控制、构建和部署等方面的复杂性，并提供更好的可重用性和协作性。

<!-- https://juejin.cn/post/7215886869199896637?searchId=202310181332272DF3F70E26C96B947D28 -->


### multirepo 和 monorepo

- multirepo(多仓库多模块应用): 将项目拆解成多个业务模块，并在多个 Git 仓库管理，模块解耦，降低了巨石应用的复杂度，每个模块都可以独立编码、测试、发版，代码管理变得简化，构建效率也得以提升，这种代码管理方式称之为 MultiRepo。

- monorepo(单模块多应用): 多个项目集成到一个仓库下，共享工程配置，同时又快捷地共享模块代码。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/14ba61eb924c4411bc4ff102f8f3f530~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp)


## pnpm 搭建

pnpm 支持 Monorepo 模式的工作机制叫做 `workspace(工作空间)`。

这种模式要求根目录下有一个 `pnpm-workspace.yaml` 用来指定哪些目录作为独立的工作空间，这个工作空间可以理解为一个 *子模块* 或者 *npm包*

例如以下的 pnpm-workspace.yaml 文件定义：a 目录、b 目录、packages和components 目录下的所有子目录，都会各自被视为独立的模块。

```pnpm-workspace.yaml
packages:
  - 'packages/**'
  - 'components/**'
  - a
  - b
```

需要注意的是，pnpm 并不是通过目录名称，而是通过目录下 package.json 文件的 name 字段来识别仓库内的包与模块的。




