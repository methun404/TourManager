<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-slate-800 pt-[env(safe-area-inset-top)] shadow-sm transition-colors duration-300">
    <div class="flex items-center justify-between h-14 px-4 max-w-md mx-auto">
      
      <button 
        @click="goBack" 
        class="p-2 -ml-2 text-gray-600 dark:text-gray-300 bg-transparent hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-all active:scale-95"
        aria-label="Go Back"
      >
        <ChevronLeft class="w-6 h-6" />
      </button>

      <div class="flex flex-col items-center justify-center">
        <h1 class="text-lg font-bold text-gray-800 dark:text-gray-100 tracking-tight leading-tight transition-colors">
          {{ title }}
        </h1>
        <span class="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest transition-colors">
          {{ isOnline ? 'Synced' : 'Offline Mode' }}
        </span>
      </div>

      <div class="flex items-center gap-2">
        
        <Transition name="fade">
          <div 
            v-if="!isOnline" 
            class="flex items-center justify-center p-1.5 bg-red-100 text-red-600 rounded-full animate-pulse"
            title="No Internet Connection"
          >
            <WifiOff class="w-4 h-4" />
          </div>
        </Transition>

        <button 
          @click="toggleTheme" 
          class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-all active:scale-95"
          aria-label="Toggle Theme"
        >
          <Moon v-if="!isDark" class="w-5 h-5" />
          <Sun v-else class="w-5 h-5" />
        </button>

        <button 
          @click="$emit('invite-members')"
          class="p-2 -mr-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-all active:scale-95"
          aria-label="Invite Members"
        >
          <Share2 class="w-5 h-5" />
        </button>

      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, Share2, WifiOff, Moon, Sun } from 'lucide-vue-next'
import { useTheme } from '../../composables/useTheme'

// Props: Receives page title from parent component (e.g. "Tour Dashboard")
defineProps({
  title: {
    type: String,
    default: 'Tour Manager'
  }
})

defineEmits(['invite-members'])

const router = useRouter()
const isOnline = ref(navigator.onLine)
const { isDark, toggleTheme } = useTheme()

// Back navigation handler
const goBack = () => {
  router.back()
}

// Function to update online/offline status
const updateOnlineStatus = () => {
  isOnline.value = navigator.onLine
}

// Register network status event listeners on mount
onMounted(() => {
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
})

// Clean up listeners on unmount to prevent memory leaks
onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus)
  window.removeEventListener('offline', updateOnlineStatus)
})
</script>

<style scoped>
/* Tailwind v4 reference */
@reference "tailwindcss";

/* Smooth Fade transition for Offline icon */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>