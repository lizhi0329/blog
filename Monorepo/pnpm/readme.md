<!--  -->

# pnpm

> Pnpm 是新一代的 nodejs 包管理工具。第一个 “P”意为 `Performance`，代表着更佳的性能。

优点：
- 采用了 hard-link 机制，避免了包的重复安装，节省了空间，同时能提高项目依赖的安装速度。
- 对 monorepo 的支持非常友好，只需要一条配置就能实现


## 使用 pnpm 搭建 monorepo
 
  1. 创建项目
    ```bash
      mkdir learnV3
      cd learnV3
      pnpm init
      mkdir packages
    ```
  2. 项目根目录下新建 `pnpm-workspace.yaml` 文件：

    ```js
      packages:
        - 'packages/*'
    ```
    意思是，将 packages 目录下所有的目录都作为单独的包进行管理。

## 安装依赖
  ```sql
  -- -D：作为开发依赖安装
  -- -w：monorepo 环境默认会认为应该将依赖安装到具体的 package中。使用 -w 参数，告诉 pnpm 将依赖安装到 workspace-root，也就是项目的根目录。
  pnpm add -D -w typescript

  ```
 

 ## dependencies、devDependencies、peerDependencies 的区别

 每个项目的 package.json 文件内都声明了项目的依赖，其中有三种类型，`dependencies`、`devDependencies`、`peerDependencies`。

 

 <!-- https://juejin.cn/post/7124613898115743757 -->
 <!-- https://juejin.cn/post/6932046455733485575#heading-6 -->