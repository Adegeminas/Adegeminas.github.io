import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// GitHub Pages: https://adegeminas.github.io/Arlight-test/ → base /Arlight-test/
// Локально: '/' или npm run preview:pages
const base = process.env.VITE_BASE_PATH ?? '/'

export default defineConfig({
  base,
  plugins: [vue()],
})
