<template>
  <Transition name="sync-banner">
    <div
      v-if="!isOnline"
      class="sync-banner fixed top-0 left-0 right-0 z-[999] flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white"
      :style="{ paddingTop: 'calc(0.5rem + env(safe-area-inset-top))' }"
    >
      <!-- Animated signal bars -->
      <span class="flex items-end gap-[2px] h-3.5">
        <span class="w-1 h-1 bg-white/60 rounded-sm"></span>
        <span class="w-1 h-2 bg-white/60 rounded-sm"></span>
        <span class="w-1 h-3 bg-white/40 rounded-sm"></span>
        <span class="w-1 h-3.5 bg-white/20 rounded-sm"></span>
      </span>
      Offline — Changes will sync when online
    </div>
  </Transition>
</template>

<script setup>
import { useOnlineStatus } from '../../composables/useOnlineStatus'
const { isOnline } = useOnlineStatus()
</script>

<style scoped>
.sync-banner {
  background: linear-gradient(90deg, #f59e0b, #d97706);
  backdrop-filter: blur(8px);
}

.sync-banner-enter-active,
.sync-banner-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
}
.sync-banner-enter-from,
.sync-banner-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
