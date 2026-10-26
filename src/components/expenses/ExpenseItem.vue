<template>
  <div 
    @click="$emit('view-details', expense)"
    class="group flex items-center justify-between p-3 sm:p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:shadow-md transition-all duration-200 cursor-pointer mb-2.5"
  >
    <div class="flex items-center gap-3.5 sm:gap-4 overflow-hidden">
      
      <div 
        class="flex items-center justify-center w-12 h-12 rounded-2xl shrink-0 transition-transform group-hover:scale-105"
        :class="categoryTheme.bg"
      >
        <component 
          :is="categoryTheme.icon" 
          class="w-5 h-5 sm:w-6 sm:h-6" 
          :class="categoryTheme.text" 
        />
      </div>

      <div class="flex flex-col min-w-0"> <h3 class="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-100 truncate">
          {{ expense.title }}
        </h3>
        
        <div class="flex items-center gap-1.5 mt-0.5 text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 font-medium">
          <span>{{ formattedDate }}</span>
          
          <template v-if="expense.paidByName || expense.paidBy">
            <span class="w-1 h-1 rounded-full bg-gray-300 dark:bg-slate-700"></span>
            <span class="truncate max-w-[80px] sm:max-w-[120px]">
              By <span class="text-gray-600 dark:text-gray-400">{{ expense.paidByName || 'Unknown' }}</span>
            </span>
          </template>
        </div>
      </div>
    </div>

    <div class="flex flex-col items-end shrink-0 pl-2">
      <span class="text-sm sm:text-base font-extrabold text-gray-800 dark:text-gray-100">
        ৳ {{ formatCurrency(expense.amount) }}
      </span>
      
      <span 
        v-if="expense.isPersonal" 
        class="text-[9px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mt-0.5 bg-indigo-50 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded transition-colors"
      >
        Personal
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Utensils, Bus, BedDouble, Ticket, ShoppingBag, Receipt } from 'lucide-vue-next'

const props = defineProps({
  expense: {
    type: Object,
    required: true
  }
})

// Emit event to open modal with expense details (edit/delete actions)
defineEmits(['view-details'])

// Set icon and theme colors based on expense category
const categoryTheme = computed(() => {
  const cat = props.expense.category?.toLowerCase() || 'other'
  
  const themes = {
    food: { icon: Utensils, bg: 'bg-orange-50 dark:bg-orange-900/40', text: 'text-orange-500 dark:text-orange-400' },
    transport: { icon: Bus, bg: 'bg-blue-50 dark:bg-blue-900/40', text: 'text-blue-500 dark:text-blue-400' },
    hotel: { icon: BedDouble, bg: 'bg-purple-50 dark:bg-purple-900/40', text: 'text-purple-500 dark:text-purple-400' },
    activity: { icon: Ticket, bg: 'bg-emerald-50 dark:bg-emerald-900/40', text: 'text-emerald-500 dark:text-emerald-400' },
    shopping: { icon: ShoppingBag, bg: 'bg-pink-50 dark:bg-pink-900/40', text: 'text-pink-500 dark:text-pink-400' },
    other: { icon: Receipt, bg: 'bg-gray-100 dark:bg-slate-800', text: 'text-gray-500 dark:text-gray-400' }
  }

  // Fallback to 'other' theme if category does not match
  return themes[cat] || themes.other
})

// Format date and time string (e.g. "12 Oct, 10:30 AM")
const formattedDate = computed(() => {
  const rawDate = props.expense.date || props.expense.createdAt
  if (!rawDate) return 'Unknown date'
  
  const dateObj = new Date(rawDate)
  return dateObj.toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
})

// Format currency amount with locale-specific separators
const formatCurrency = (amount) => {
  return Number(amount || 0).toLocaleString('en-IN')
}
</script>

<style scoped>
@reference "tailwindcss";
</style>