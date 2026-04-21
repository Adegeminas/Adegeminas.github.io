import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

function resolveBase() {
  const explicit = process.env.VITE_BASE_PATH
  if (explicit != null && String(explicit).trim() !== '') {
    let b = String(explicit).trim()
    if (!b.startsWith('/')) b = `/${b}`
    return b.endsWith('/') ? b : `${b}/`
  }
  return './'
}

export default defineConfig({
  base: resolveBase(),
  plugins: [vue()],
})
