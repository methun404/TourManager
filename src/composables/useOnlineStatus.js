import { ref, onMounted, onUnmounted } from 'vue'

const isOnline = ref(navigator.onLine)
const pendingSyncCount = ref(0)

// Global listeners (singleton pattern — attached only once)
let listenersAdded = false

function setupListeners() {
  if (listenersAdded) return
  listenersAdded = true

  const handleOnline = () => {
    isOnline.value = true
  }
  const handleOffline = () => {
    isOnline.value = false
  }

  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
}

export function useOnlineStatus() {
  onMounted(() => {
    setupListeners()
    isOnline.value = navigator.onLine
  })

  return {
    isOnline,
    pendingSyncCount,
  }
}
