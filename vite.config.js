import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/**
 * Относительный base — скрипты и стили грузятся от текущего URL страницы
 * (например …/Arlight-test/assets/…), без привязки к имени репо в CI.
 * Иначе при base: '/' сборка даёт /assets/… → на GitHub Pages это 404 HTML → MIME error.
 *
 * Переопределение: VITE_BASE_PATH=/Arlight-test/ npm run build
 */
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
