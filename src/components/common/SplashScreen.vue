<template>
  <Transition name="fade">
    <div 
      v-if="show" 
      class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-900 text-white overflow-hidden"
    >
      <div class="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-blue-400 opacity-10 rounded-full blur-3xl"></div>

      <div class="relative flex items-center justify-center w-28 h-28 mb-6 bg-white/10 border border-white/20 rounded-full backdrop-blur-md shadow-2xl animate-bounce-slow">
        <svg class="w-14 h-14 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>

      <h1 class="text-4xl font-extrabold tracking-tight mb-2 drop-shadow-lg flex items-center">
        Tour<span class="text-blue-300 ml-1">Manager</span>
      </h1>

      <p class="text-sm text-blue-100/80 mb-10 font-medium tracking-widest uppercase text-center px-4">
        Track every expense, flawlessly
      </p>

      <div class="w-40 h-1.5 bg-blue-900/50 rounded-full overflow-hidden shadow-inner">
        <div class="h-full bg-white rounded-full animate-progress"></div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

// Props: Receives loading state from main app until initialization completes
const props = defineProps({
  isLoading: {
    type: Boolean,
    required: true
  }
})

const show = ref(true)

// When app finishes loading, delay removing splash screen for a smooth transition
watch(() => props.isLoading, (newValue) => {
  if (!newValue) {
    setTimeout(() => {
      show.value = false
    }, 600) // 600ms delay for visual smoothness
  }
})

// Safety fallback: Automatically hide after 4 seconds if response is delayed
onMounted(() => {
  setTimeout(() => {
    if (show.value) show.value = false
  }, 4000)
})
</script>

<style scoped>
/* Vue Transition Classes for Fade and slight scale effect */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease-in-out, transform 0.8s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(1.05); /* Slight zoom-in while fading out on exit */
}

/* Custom Progress Bar Animation */
@keyframes progress {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(20%); }
  100% { transform: translateX(100%); }
}
.animate-progress {
  width: 50%;
  animation: progress 1.2s infinite ease-in-out;
}

/* Elegant Slow Bounce for Logo */
@keyframes bounce-slow {
  0%, 100% { 
    transform: translateY(-8%); 
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1); 
  }
  50% { 
    transform: translateY(0); 
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1); 
  }
}
.animate-bounce-slow {
  animation: bounce-slow 3s infinite;
}
</style>