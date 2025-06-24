import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/webp-to-png/',
  plugins: [vue()],
})
