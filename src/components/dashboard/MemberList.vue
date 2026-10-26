<template>
  <div class="bg-white border border-gray-100 rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] overflow-hidden">
    
    <div class="flex items-center justify-between px-5 py-4 border-b border-gray-50 bg-gray-50/50">
      <div class="flex items-center gap-2">
        <Users class="w-5 h-5 text-gray-500" />
        <h2 class="text-sm font-bold text-gray-800 tracking-tight">Tour Members</h2>
      </div>
      <span class="px-2.5 py-0.5 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
        {{ members.length }}
      </span>
    </div>

    <div class="p-2">
      <TransitionGroup 
        name="list" 
        tag="ul" 
        class="flex flex-col gap-1"
      >
        <li 
          v-for="member in members" 
          :key="member.id"
          class="group flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200"
        >
          
          <div class="flex items-center gap-3">
            <div class="relative flex items-center justify-center w-10 h-10 rounded-full shadow-inner bg-gradient-to-br from-gray-100 to-gray-200 shrink-0">
              <img 
                v-if="member.avatar" 
                :src="member.avatar" 
                alt="Avatar" 
                class="w-full h-full rounded-full object-cover"
              />
              <span v-else class="text-sm font-bold text-gray-500">
                {{ getInitials(member.name) }}
              </span>

              <div 
                v-if="member.role === 'admin'" 
                class="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm"
                title="Admin"
              >
                <ShieldCheck class="w-3.5 h-3.5 text-blue-500" />
              </div>
            </div>

            <div class="flex flex-col">
              <span class="text-sm font-semibold text-gray-800 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                {{ member.name }}
              </span>
              <span class="text-[10px] font-medium text-gray-400">
                {{ member.role === 'admin' ? 'Administrator' : 'Member' }}
              </span>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="flex flex-col items-end">
              <span class="text-sm font-bold text-gray-800">
                ৳ {{ formatCurrency(member.contribution) }}
              </span>
              <span v-if="member.pendingAmount > 0" class="text-[9px] font-semibold text-orange-500">
                + ৳{{ formatCurrency(member.pendingAmount) }} pending
              </span>
            </div>

            <button 
              @click="$emit('manage-member', member)"
              class="p-1.5 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100 md:opacity-100"
              title="Manage Member"
            >
              <MoreVertical class="w-4 h-4" />
            </button>
          </div>

        </li>
      </TransitionGroup>

      <div v-if="members.length === 0" class="flex flex-col items-center justify-center py-8 text-gray-400">
        <UserMinus class="w-8 h-8 mb-2 opacity-50" />
        <p class="text-sm font-medium">No members joined yet.</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { Users, ShieldCheck, MoreVertical, UserMinus } from 'lucide-vue-next'

const props = defineProps({
  members: {
    type: Array,
    required: true,
    default: () => []
  }
})

defineEmits(['manage-member'])

// Extract initials from member name for avatar placeholder
const getInitials = (name) => {
  if (!name) return '?'
  const parts = name.split(' ')
  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

// Format currency amount with locale-specific separators
const formatCurrency = (amount) => {
  return Number(amount || 0).toLocaleString('en-IN')
}
</script>

<style scoped>
@reference "tailwindcss";

/* Vue Transition Group Classes for smooth list add/remove animations */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-enter-from {
  opacity: 0;
  transform: translateY(15px) scale(0.98);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Maintain smooth list layout adjustment when an item is removed */
.list-leave-active {
  position: absolute;
}
</style>