import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 9001,
    proxy: {
      '/students': { target: 'http://localhost:3000', changeOrigin: true },
      '/materials': { target: 'http://localhost:3000', changeOrigin: true },
      '/quizzes': { target: 'http://localhost:3000', changeOrigin: true },
      '/questions': { target: 'http://localhost:3000', changeOrigin: true },
    }
  },
})
