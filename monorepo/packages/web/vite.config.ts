// demo/vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { join } from 'node:path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
  },
})
