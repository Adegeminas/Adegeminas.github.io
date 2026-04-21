import { ref, onMounted, onBeforeUnmount } from 'vue'

const THEME_STORAGE_KEY = 'app-theme'

function applyThemeToDocument(value) {
  document.documentElement.dataset.theme = value
  try {
    localStorage.setItem(THEME_STORAGE_KEY, value)
  } catch {
    /* ignore */
  }
}

/**
 * Счётчик вкладок и тема через Shared Worker; при отсутствии — fallback.
 */
export function useSharedSync() {
  const openTabs = ref(1)
  const theme = ref('light')
  const sharedWorkerSupported = typeof SharedWorker !== 'undefined'

  let worker = null

  function setTheme(next) {
    const value = next === 'dark' ? 'dark' : 'light'
    if (worker?.port) {
      worker.port.postMessage({ type: 'set-theme', value })
    } else {
      theme.value = value
      applyThemeToDocument(value)
    }
  }

  function toggleTheme() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  function onWorkerMessage(e) {
    const data = e.data
    if (!data || typeof data !== 'object') return
    if (data.type === 'tabs' && typeof data.count === 'number') {
      openTabs.value = data.count
    }
    if (data.type === 'theme' && (data.value === 'light' || data.value === 'dark')) {
      theme.value = data.value
      applyThemeToDocument(data.value)
    }
  }

  function handlePageHide() {
    try {
      worker?.port?.postMessage({ type: 'disconnect' })
    } catch {
      /* ignore */
    }
  }

  onMounted(() => {
    if (!sharedWorkerSupported) {
      openTabs.value = 1
      try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY)
        if (stored === 'dark' || stored === 'light') {
          theme.value = stored
        }
      } catch {
        /* ignore */
      }
      applyThemeToDocument(theme.value)
      return
    }

    try {
      const workerUrl = `${import.meta.env.BASE_URL}shared-worker.js`
      worker = new SharedWorker(workerUrl)
      worker.port.addEventListener('message', onWorkerMessage)
      worker.port.start()
    } catch {
      openTabs.value = 1
      try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY)
        if (stored === 'dark' || stored === 'light') {
          theme.value = stored
        }
      } catch {
        /* ignore */
      }
      applyThemeToDocument(theme.value)
      return
    }

    window.addEventListener('pagehide', handlePageHide)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('pagehide', handlePageHide)
    handlePageHide()
    try {
      worker?.port?.removeEventListener('message', onWorkerMessage)
    } catch {
      /* ignore */
    }
  })

  return {
    openTabs,
    theme,
    setTheme,
    toggleTheme,
    sharedWorkerSupported,
  }
}
