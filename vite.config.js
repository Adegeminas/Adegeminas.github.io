import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// GitHub Pages (project site): /REPO_NAME/
// Локально и для user site: оставьте '/' или задайте VITE_BASE_PATH при сборке
const base = process.env.VITE_BASE_PATH ?? '/'

export default defineConfig({
  base,
  plugins: [vue()],
})
