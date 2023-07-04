- [环境变量配置](#环境变量配置)

# 环境变量配置

1. 配置 环境变量入口

   ```js
   // vite.config.ts 中配置环境变量入口
   envDir: './viteEnv',
   ```

2. 配置环境变量文件
   新建 viteEnv 文件夹
   环境变量文件以`.env`开头, 例如：`.env.dev`, `.env.prod`

3. 配置 package.json 命令，加入--mode 环境 表示要加载的环境
   例如：

   ```js
   "scripts": {
       "dev": "vite --mode dev",
       "build": "vite build",
       "preview": "vite preview",
       "test": "vite build --mode test"
     },

   ```

# build配置

## 去除log、debugger

   ```js
      esbuild: {
         drop: ['console', 'debugger']
      },
   ```
