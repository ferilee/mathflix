import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'pwa-icon.svg'],
      manifest: {
        name: 'Mathflix Guru',
        short_name: 'Mathflix',
        description: 'Teacher Dashboard for Mathflix Learning Platform',
        theme_color: '#4f46e5',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-icon.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: 'pwa-icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server: {
    port: 9001,
    proxy: {
      '/students': { target: 'http://localhost:3000', changeOrigin: true },
      '/materials': { target: 'http://localhost:3000', changeOrigin: true },
      '/quizzes': { target: 'http://localhost:3000', changeOrigin: true },
      '/questions': { target: 'http://localhost:3000', changeOrigin: true },
      '/announcements': { target: 'http://localhost:3000', changeOrigin: true },
      '/analytics': { target: 'http://localhost:3000', changeOrigin: true },
      '/discussions': { target: 'http://localhost:3000', changeOrigin: true },
      '/assignments': { target: 'http://localhost:3000', changeOrigin: true },
      '/reflections': { target: 'http://localhost:3000', changeOrigin: true },
      '/badges': { target: 'http://localhost:3000', changeOrigin: true },
    }
  },
})
