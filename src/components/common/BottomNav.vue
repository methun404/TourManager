<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-gray-100 dark:border-slate-800 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] transition-colors duration-300">
    <div class="flex justify-between items-center h-16 px-4 md:px-8 max-w-md mx-auto relative">
      
      <router-link 
        to="/dashboard" 
        class="nav-item group"
        active-class="text-blue-600 dark:text-blue-400"
        exact-active-class="text-blue-600 dark:text-blue-400"
      >
        <LayoutDashboard class="w-6 h-6 mb-1 transition-transform group-hover:scale-110 group-active:scale-95 text-gray-400 dark:text-gray-500 group-[.router-link-active]:text-blue-600 dark:group-[.router-link-active]:text-blue-400" />
        <span class="text-[10px] font-medium text-gray-500 dark:text-gray-400 group-[.router-link-active]:text-blue-600 dark:group-[.router-link-active]:text-blue-400">Group</span>
      </router-link>

      <router-link 
        to="/personal" 
        class="nav-item group"
        active-class="text-blue-600 dark:text-blue-400"
      >
        <Wallet class="w-6 h-6 mb-1 transition-transform group-hover:scale-110 group-active:scale-95 text-gray-400 dark:text-gray-500 group-[.router-link-active]:text-blue-600 dark:group-[.router-link-active]:text-blue-400" />
        <span class="text-[10px] font-medium text-gray-500 dark:text-gray-400 group-[.router-link-active]:text-blue-600 dark:group-[.router-link-active]:text-blue-400">Personal</span>
      </router-link>

      <div class="relative -top-5 flex justify-center w-1/5">
        <button 
          @click="$emit('open-add-modal')"
          class="flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-full text-white shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 active:scale-90 transition-all duration-300"
        >
          <Plus class="w-7 h-7" />
        </button>
      </div>

      <router-link
        to="/alerts"
        class="nav-item group relative"
        active-class="text-indigo-600 dark:text-indigo-400"
      >
        <div class="relative">
          <Bell class="w-6 h-6 mb-1 transition-transform group-hover:scale-110 group-active:scale-95 text-gray-400 dark:text-gray-500 group-[.router-link-active]:text-indigo-600 dark:group-[.router-link-active]:text-indigo-400" />
          <!-- Unread badge: shows when there are active alerts -->
          <span v-if="hasActiveAlerts" class="absolute -top-1 -right-1 flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-indigo-500 border border-white dark:border-slate-900"></span>
          </span>
        </div>
        <span class="text-[10px] font-medium text-gray-500 dark:text-gray-400 group-[.router-link-active]:text-indigo-600 dark:group-[.router-link-active]:text-indigo-400">Alerts</span>
      </router-link>

      <router-link 
        to="/settings" 
        class="nav-item group"
        active-class="text-blue-600 dark:text-blue-400"
      >
        <User class="w-6 h-6 mb-1 transition-transform group-hover:scale-110 group-active:scale-95 text-gray-400 dark:text-gray-500 group-[.router-link-active]:text-blue-600 dark:group-[.router-link-active]:text-blue-400" />
        <span class="text-[10px] font-medium text-gray-500 dark:text-gray-400 group-[.router-link-active]:text-blue-600 dark:group-[.router-link-active]:text-blue-400">Profile</span>
      </router-link>

    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { LayoutDashboard, Wallet, Plus, Bell, User } from 'lucide-vue-next'
import { useAlertStore } from '../../stores/alertStore'

defineEmits(['open-add-modal'])

const alertStore = useAlertStore()
const hasActiveAlerts = computed(() => alertStore.activeAlerts.length > 0)
</script>

<style scoped>
@reference "tailwindcss";

.nav-item {
  @apply flex flex-col items-center justify-center w-1/5 text-gray-400 dark:text-gray-500 transition-colors duration-300;
}

.router-link-active svg {
  @apply stroke-[2.5px] drop-shadow-sm;
}
</style>