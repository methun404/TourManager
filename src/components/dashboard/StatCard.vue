<template>
  <div 
    class="relative overflow-hidden bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] p-5 transition-transform hover:scale-[1.02] duration-300 border border-gray-50/50"
  >
    <div 
      class="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-3xl opacity-20 pointer-events-none"
      :class="colorClasses.bgGradient"
    ></div>

    <div class="flex items-start justify-between relative z-10">
      
      <div class="flex flex-col gap-1">
        <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {{ title }}
        </h3>
        
        <div class="flex items-baseline gap-1 mt-1">
          <span class="text-sm font-medium text-gray-400" v-if="prefix">{{ prefix }}</span>
          <span class="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">
            {{ displayValue }}
          </span>
          <span class="text-sm font-medium text-gray-400" v-if="suffix">{{ suffix }}</span>
        </div>

        <p v-if="subText" class="text-[10px] sm:text-xs font-medium mt-1 flex items-center gap-1" :class="colorClasses.subText">
          <component :is="trendIcon" v-if="trendIcon" class="w-3 h-3" />
          {{ subText }}
        </p>
      </div>

      <div 
        class="flex items-center justify-center w-12 h-12 rounded-2xl shadow-inner shrink-0"
        :class="colorClasses.iconBg"
      >
        <slot name="icon">
          <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </slot>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { TrendingUp, TrendingDown, Minus } from 'lucide-vue-next'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  prefix: {
    type: String,
    default: '৳' // Since it's for BD currency by default
  },
  suffix: {
    type: String,
    default: ''
  },
  subText: {
    type: String,
    default: ''
  },
  trend: {
    type: String,
    default: 'neutral', // 'up', 'down', 'neutral'
    validator: (value) => ['up', 'down', 'neutral'].includes(value)
  },
  theme: {
    type: String,
    default: 'blue', // 'blue', 'green', 'red', 'purple', 'orange'
  }
})

// Number Animation Logic
const displayValue = ref(typeof props.value === 'number' ? 0 : props.value)

const animateValue = (start, end, duration) => {
  if (typeof end !== 'number') {
    displayValue.value = end
    return
  }
  
  let startTimestamp = null
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp
    const progress = Math.min((timestamp - startTimestamp) / duration, 1)
    
    // easeOutQuart
    const easeProgress = 1 - Math.pow(1 - progress, 4)
    const current = Math.floor(easeProgress * (end - start) + start)
    
    displayValue.value = current.toLocaleString('en-IN') // Format with commas
    
    if (progress < 1) {
      window.requestAnimationFrame(step)
    } else {
      displayValue.value = end.toLocaleString('en-IN')
    }
  }
  window.requestAnimationFrame(step)
}

watch(() => props.value, (newVal, oldVal) => {
  if (typeof newVal === 'number') {
    const start = typeof oldVal === 'number' ? oldVal : 0
    animateValue(start, newVal, 800) // 800ms duration
  } else {
    displayValue.value = newVal
  }
})

onMounted(() => {
  if (typeof props.value === 'number') {
    animateValue(0, props.value, 1000)
  }
})

// Theme configuration for different card types
const colorClasses = computed(() => {
  const themes = {
    blue: {
      bgGradient: 'bg-blue-400',
      iconBg: 'bg-blue-50 text-blue-600',
      subText: props.trend === 'up' ? 'text-green-500' : (props.trend === 'down' ? 'text-red-500' : 'text-gray-400')
    },
    green: {
      bgGradient: 'bg-emerald-400',
      iconBg: 'bg-emerald-50 text-emerald-600',
      subText: 'text-emerald-500'
    },
    red: {
      bgGradient: 'bg-rose-400',
      iconBg: 'bg-rose-50 text-rose-600',
      subText: 'text-rose-500'
    },
    purple: {
      bgGradient: 'bg-purple-400',
      iconBg: 'bg-purple-50 text-purple-600',
      subText: 'text-purple-500'
    },
    orange: {
      bgGradient: 'bg-orange-400',
      iconBg: 'bg-orange-50 text-orange-600',
      subText: 'text-orange-500'
    }
  }
  return themes[props.theme] || themes.blue
})

// Trend Icon Computed Property
const trendIcon = computed(() => {
  if (props.trend === 'up') return TrendingUp
  if (props.trend === 'down') return TrendingDown
  if (props.trend === 'neutral' && props.subText) return Minus
  return null
})
</script>

<style scoped>
@reference "tailwindcss";
</style>