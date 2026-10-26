import { ref, onMounted, onUnmounted } from "vue";
import { firestore } from "@/services/firebase";
import { onSnapshotsInSync } from "firebase/firestore";

export function useOfflineSync() {
  const isOnline = ref(window.navigator.onLine);
  const isSyncing = ref(false);
  const lastSyncTime = ref(localStorage.getItem("last_sync_time") || null);

  // 1. Function to update network connectivity status
  const updateOnlineStatus = () => {
    isOnline.value = window.navigator.onLine;
    if (isOnline.value) {
      console.log("🌐 App is back online. Syncing data...");
    } else {
      console.log("📡 App is offline. Changes will be saved locally.");
    }
  };

  // 2. Track Firebase synchronization status
  // Invoked when Firestore finishes syncing data snapshots with server
  let unsubscribeSync = null;

  onMounted(() => {
    // Add browser online/offline event listeners
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    // Firestore sync listener
    unsubscribeSync = onSnapshotsInSync(firestore, () => {
      // Triggered when local data is fully in sync with server
      isSyncing.value = false;
      const now = new Date().toLocaleTimeString();
      lastSyncTime.value = now;
      localStorage.setItem("last_sync_time", now);
    });
  });

  onUnmounted(() => {
    // Remove listeners on unmount to prevent memory leaks
    window.removeEventListener("online", updateOnlineStatus);
    window.removeEventListener("offline", updateOnlineStatus);
    if (unsubscribeSync) unsubscribeSync();
  });

  /**
   * Helper function to manually indicate syncing state
   * Useful when submitting changes to show user a 'Syncing...' indicator
   */
  const startSyncManual = () => {
    if (isOnline.value) {
      isSyncing.value = true;
    }
  };

  return {
    isOnline,
    isSyncing,
    lastSyncTime,
    startSyncManual,
  };
}
