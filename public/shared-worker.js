/**
 * Shared Worker: синхронизация числа вкладок и темы между вкладками.
 */
const ports = new Set()
let theme = 'light'

function broadcastTabs() {
  const count = ports.size
  for (const port of ports) {
    port.postMessage({ type: 'tabs', count })
  }
}

function broadcastTheme() {
  for (const port of ports) {
    port.postMessage({ type: 'theme', value: theme })
  }
}

self.onconnect = (event) => {
  const port = event.ports[0]
  ports.add(port)
  port.start()

  broadcastTabs()
  port.postMessage({ type: 'theme', value: theme })

  port.addEventListener('message', (e) => {
    const data = e.data
    if (!data || typeof data !== 'object') return

    if (data.type === 'disconnect') {
      ports.delete(port)
      broadcastTabs()
      return
    }

    if (data.type === 'set-theme') {
      theme = data.value === 'dark' ? 'dark' : 'light'
      broadcastTheme()
    }
  })
}
