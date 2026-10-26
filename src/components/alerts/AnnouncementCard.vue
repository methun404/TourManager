<template>
  <div class="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-colors">
    <!-- Colored top strip by type -->
    <div class="h-1 w-full"
      :class="alert.type === 'reminder'
        ? 'bg-amber-400 dark:bg-amber-500'
        : 'bg-blue-500 dark:bg-blue-600'">
    </div>

    <div class="p-4">
      <!-- Header row -->
      <div class="flex items-start justify-between gap-2">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1.5">
            <span class="flex items-center justify-center w-7 h-7 rounded-full shrink-0"
              :class="alert.type === 'reminder'
                ? 'bg-amber-100 dark:bg-amber-900/40'
                : 'bg-blue-100 dark:bg-blue-900/40'">
              <Bell v-if="alert.type === 'announcement'" class="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <AlarmClock v-else class="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            </span>
            <span class="text-[10px] font-bold uppercase tracking-wider"
              :class="alert.type === 'reminder'
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-blue-600 dark:text-blue-400'">
              {{ alert.type === 'reminder' ? 'Reminder' : 'Announcement' }}
            </span>
            <span v-if="alert.status === 'ended'"
              class="text-[9px] font-bold px-1.5 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 rounded-full">
              Ended
            </span>
          </div>
          <h3 class="text-sm font-bold text-gray-800 dark:text-gray-100 leading-snug">{{ alert.title }}</h3>
        </div>

        <!-- Admin controls -->
        <div v-if="isAdmin" class="flex gap-1 shrink-0">
          <template v-if="alert.status === 'active'">
            <button @click="$emit('edit', alert)"
              class="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <Pencil class="w-3.5 h-3.5" />
            </button>
            <button @click="$emit('end', alert)"
              class="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:bg-amber-50 dark:hover:bg-amber-900/30 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              <CheckSquare class="w-3.5 h-3.5" />
            </button>
          </template>
          <template v-if="alert.status === 'ended'">
            <button @click="$emit('reactivate', alert)"
              class="p-1.5 rounded-lg text-gray-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              <RotateCcw class="w-3.5 h-3.5" />
            </button>
          </template>
          <button @click="$emit('delete', alert)"
            class="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 dark:hover:text-red-400 transition-colors">
            <Trash2 class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <!-- Message body -->
      <p v-if="alert.message" class="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-slate-800/50 rounded-xl px-3 py-2.5 transition-colors">
        {{ alert.message }}
      </p>

      <!-- Footer -->
      <div class="flex items-center justify-between mt-3">
        <span class="text-[10px] text-gray-400 dark:text-gray-500">
          By <span class="font-semibold">{{ alert.createdByName }}</span> · {{ fmtDate(alert.createdAt) }}
        </span>
        <span v-if="alert.endsAt && alert.status === 'active'"
          class="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
          <AlarmClock class="w-3 h-3" /> {{ fmtDate(alert.endsAt) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Bell, AlarmClock, Pencil, Trash2, CheckSquare, RotateCcw } from 'lucide-vue-next'

defineProps({
  alert: { type: Object, required: true },
  isAdmin: { type: Boolean, default: false },
})

defineEmits(['edit', 'delete', 'end', 'reactivate'])

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
</script>

<style scoped>
@reference "tailwindcss";
</style>
