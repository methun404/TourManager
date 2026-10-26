<template>
  <div class="min-h-screen relative flex flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50 font-sans text-gray-900 selection:bg-blue-200 overflow-hidden">
    
    <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div class="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] max-w-[400px] max-h-[400px] bg-blue-400/20 rounded-full blur-[80px]"></div>
      <div class="absolute top-[60%] -right-[10%] w-[60vw] h-[60vw] max-w-[500px] max-h-[500px] bg-indigo-400/20 rounded-full blur-[80px]"></div>
    </div>

    <div class="w-full max-w-md relative z-10 flex flex-col gap-6 sm:gap-8">
      
      <div class="flex flex-col items-center justify-center text-center">
        <div class="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl shadow-xl shadow-blue-500/30 flex items-center justify-center mb-4 transform -rotate-6 transition-transform hover:rotate-0 duration-300">
          <Map class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">
          Tour Manager
        </h1>
        <p class="text-sm text-gray-500 font-medium mt-1">
          Manage your group expenses easily
        </p>
      </div>

      <div class="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        
        <router-view v-slot="{ Component }">
          <transition name="auth-fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>

      </div>
      
    </div>
  </div>
</template>

<script setup>
import { Map } from 'lucide-vue-next'
</script>

<style scoped>
@reference "tailwindcss";

/* Auth Page Transition Animations 
  Smooth fade and scale transition between login and registration views
*/
.auth-fade-enter-active,
.auth-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.auth-fade-enter-from {
  opacity: 0;
  transform: translateY(15px) scale(0.98);
}

.auth-fade-leave-to {
  opacity: 0;
  transform: translateY(-15px) scale(0.98);
}
</style>