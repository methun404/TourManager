<template>
  <div 
    class="relative overflow-hidden bg-gray-200 dark:bg-slate-800 rounded-xl transition-colors duration-300"
    :class="[widthClass, heightClass, { 'rounded-full': circle }]"
  >
    <div class="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent"></div>
  </div>
</template>

<script setup>
defineProps({
  widthClass: { type: String, default: 'w-full' },
  heightClass: { type: String, default: 'h-4' },
  circle: { type: Boolean, default: false }
})
</script>

<style scoped>
@reference "tailwindcss";

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>
