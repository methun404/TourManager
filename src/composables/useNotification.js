import { ref } from 'vue'

const notifPermission = ref(typeof Notification !== 'undefined' ? Notification.permission : 'default')
const isEnabled = ref(localStorage.getItem('notif_enabled') !== 'false') // Default to true if not set

export function useNotification() {
  /**
   * Request notification permission from the browser/device.
   * Returns true if granted, false otherwise.
   */
  const requestPermission = async () => {
    if (typeof Notification === 'undefined') return false
    if (notifPermission.value === 'granted') return true
    if (notifPermission.value === 'denied') return false

    const result = await Notification.requestPermission()
    notifPermission.value = result
    return result === 'granted'
  }

  /**
   * Show a local notification. Works even when app is in background
   * via the service worker.
   */
  const showNotification = async (title, options = {}) => {
    if (notifPermission.value !== 'granted' || !isEnabled.value) return

    const defaultOptions = {
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      vibrate: [100, 50, 100],
      ...options
    }

    // Use service worker for background notifications if available
    if ('serviceWorker' in navigator) {
      const sw = await navigator.serviceWorker.ready
      if (sw) {
        try {
          await sw.showNotification(title, defaultOptions)
          return
        } catch (e) {
          // fallback to direct Notification
        }
      }
    }

    // Fallback: direct Notification API
    try {
      new Notification(title, defaultOptions)
    } catch (e) {
      console.warn('Notification failed:', e)
    }
  }

  const toggleNotifications = () => {
    isEnabled.value = !isEnabled.value
    localStorage.setItem('notif_enabled', isEnabled.value.toString())
    return isEnabled.value
  }

  return {
    notifPermission,
    isEnabled,
    requestPermission,
    showNotification,
    toggleNotifications,
  }
}
