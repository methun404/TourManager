<template>
  <div class="relative bg-white border border-gray-100 rounded-2xl p-4 shadow-[0_4px_15px_-5px_rgba(0,0,0,0.05)] transition-all hover:shadow-md">
    
    <div 
      class="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
      :class="typeDetails.borderColor"
    ></div>

    <div class="flex items-start gap-3.5">
      
      <div class="relative shrink-0">
        <div class="flex items-center justify-center w-10 h-10 rounded-full shadow-inner bg-gradient-to-br from-gray-100 to-gray-200">
          <img 
            v-if="request.userAvatar" 
            :src="request.userAvatar" 
            alt="Avatar" 
            class="w-full h-full rounded-full object-cover"
          />
          <span v-else class="text-sm font-bold text-gray-500">
            {{ getInitials(request.userName) }}
          </span>
        </div>
        <div 
          class="absolute -bottom-1 -right-1 p-1 rounded-full text-white shadow-sm"
          :class="typeDetails.iconBg"
        >
          <component :is="typeDetails.icon" class="w-3 h-3" />
        </div>
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex justify-between items-start">
          <h4 class="text-sm font-bold text-gray-800 truncate pr-2">
            {{ request.userName }}
          </h4>
          <span class="text-[9px] font-medium text-gray-400 whitespace-nowrap mt-0.5">
            {{ formattedTime }}
          </span>
        </div>
        
        <p class="text-xs text-gray-500 mt-0.5 leading-relaxed">
          <span v-if="request.type === 'deposit'">
            requested to add <strong class="text-gray-800">৳{{ formatCurrency(request.amount) }}</strong> to group fund.
          </span>
          <span v-else-if="request.type === 'expense'">
            added a new expense of <strong class="text-gray-800">৳{{ formatCurrency(request.amount) }}</strong> for {{ request.note || 'the group' }}.
          </span>
          <span v-else-if="request.type === 'join'">
            requested to join this tour group.
          </span>
          <span v-else>
            sent a new request.
          </span>
        </p>
      </div>

    </div>

    <div class="flex items-center gap-2 mt-4 pl-12 sm:pl-13">
      <button 
        @click="$emit('reject', request.id)"
        class="flex-1 py-2 px-3 text-xs font-bold text-gray-500 bg-gray-100 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors active:scale-95 flex items-center justify-center gap-1.5"
      >
        <X class="w-3.5 h-3.5" />
        Decline
      </button>
      
      <button 
        @click="$emit('approve', request.id)"
        class="flex-1 py-2 px-3 text-xs font-bold text-white rounded-lg transition-all active:scale-95 shadow-sm flex items-center justify-center gap-1.5"
        :class="typeDetails.btnBg"
      >
        <Check class="w-3.5 h-3.5" />
        Approve
      </button>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Check, X, Wallet, ReceiptText, UserPlus, Bell } from 'lucide-vue-next'

const props = defineProps({
  request: {
    type: Object,
    required: true
  }
})

defineEmits(['approve', 'reject'])

// Assign colors and icons based on request type
const typeDetails = computed(() => {
  const type = props.request.type
  
  if (type === 'deposit') {
    return {
      borderColor: 'bg-emerald-400',
      iconBg: 'bg-emerald-500',
      icon: Wallet,
      btnBg: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
    }
  } else if (type === 'expense') {
    return {
      borderColor: 'bg-blue-400',
      iconBg: 'bg-blue-500',
      icon: ReceiptText,
      btnBg: 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
    }
  } else if (type === 'join') {
    return {
      borderColor: 'bg-purple-400',
      iconBg: 'bg-purple-500',
      icon: UserPlus,
      btnBg: 'bg-purple-600 hover:bg-purple-700 shadow-purple-200'
    }
  }
  
  // Default fallback
  return {
    borderColor: 'bg-gray-400',
    iconBg: 'bg-gray-500',
    icon: Bell,
    btnBg: 'bg-gray-800 hover:bg-gray-900 shadow-gray-200'
  }
})

// Extract initials from user name for avatar placeholder
const getInitials = (name) => {
  if (!name) return '?'
  const parts = name.split(' ')
  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

// Format timestamp (e.g. "10:30 AM")
const formattedTime = computed(() => {
  if (!props.request.timestamp) return 'Just now'
  
  const dateObj = new Date(props.request.timestamp)
  return dateObj.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
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