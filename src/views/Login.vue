<template>
  <div class="p-6 sm:p-8 flex flex-col gap-6 animate-fade-in">
    
    <div class="text-center">
      <h2 class="text-2xl font-extrabold text-gray-800 tracking-tight">
        Welcome Back!
      </h2>
      <p class="text-sm text-gray-500 mt-1.5 font-medium">
        Enter your details to access your account.
      </p>
    </div>

    <form @submit.prevent="handleLogin" class="flex flex-col gap-4 mt-2">
      
      <div>
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 pl-1">
          Email Address
        </label>
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
            <Mail class="w-5 h-5" />
          </div>
          <input 
            v-model="form.email" 
            type="email" 
            required
            placeholder="you@example.com" 
            class="w-full pl-11 pr-4 py-3.5 bg-white/50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-gray-800 text-sm"
          />
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between mb-1.5 px-1">
          <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider">
            Password
          </label>
          <a href="#" class="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
            Forgot?
          </a>
        </div>
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
            <Lock class="w-5 h-5" />
          </div>
          <input 
            v-model="form.password" 
            :type="showPassword ? 'text' : 'password'" 
            required
            placeholder="••••••••" 
            class="w-full pl-11 pr-12 py-3.5 bg-white/50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-gray-800 text-sm font-medium tracking-wide"
          />
          <button 
            type="button"
            @click="showPassword = !showPassword"
            class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
          >
            <Eye v-if="!showPassword" class="w-5 h-5" />
            <EyeOff v-else class="w-5 h-5" />
          </button>
        </div>
      </div>

      <button 
        type="submit" 
        :disabled="isLoading"
        class="w-full mt-4 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
      >
        <Loader2 v-if="isLoading" class="w-5 h-5 animate-spin" />
        <template v-else>
          Log In
          <ArrowRight class="w-4 h-4" />
        </template>
      </button>

    </form>

    <p class="text-center text-sm font-medium text-gray-500 mt-2">
      Don't have an account? 
      <router-link to="/register" class="text-blue-600 font-bold hover:underline underline-offset-2">
        Sign up
      </router-link>
    </p>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-vue-next'
import { auth } from '../services/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

const router = useRouter()

// Form reactive state
const form = reactive({
  email: '',
  password: ''
})

// UI state
const showPassword = ref(false)
const isLoading = ref(false)

// Login submit handler
const handleLogin = async () => {
  isLoading.value = true
  
  try {
    await signInWithEmailAndPassword(auth, form.email, form.password)
    router.push('/welcome')
  } catch (error) {
    console.error('Login failed:', error)
    alert(error.message)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
@reference "tailwindcss";

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>