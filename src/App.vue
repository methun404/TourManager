<template>
  <transition name="fade" mode="out-in">
    
    <div v-if="showSplash" key="splash">
      <SplashScreen :isLoading="showSplash" />
    </div>

    <div v-else key="app" class="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>

  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import SplashScreen from './components/common/SplashScreen.vue'
import { useTheme } from './composables/useTheme'

// Splash screen visibility state
const showSplash = ref(true)

const { initTheme } = useTheme()

onMounted(() => {
  initTheme()
  // Hide splash screen after 3 seconds
  setTimeout(() => {
    showSplash.value = false
  }, 3000)
})
</script>

<style>
@reference "tailwindcss";

/* 1. Splash screen transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 2. Global page transition (for router views) */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(5px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* Global typography and baseline styles */
body {
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  @apply bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 transition-colors duration-300;
}

/* Custom NProgress Theme */
#nprogress .bar {
  background: #3b82f6 !important; /* text-blue-500 */
  height: 4px !important;
}
#nprogress .peg {
  box-shadow: 0 0 10px #3b82f6, 0 0 5px #3b82f6 !important;
}
</style>