<template>
  <div class="relative">
    <!-- Poll Badge -->
    <div class="absolute -top-1 left-0 right-0 flex justify-center">
      <span class="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
        :class="poll.allowMultiple
          ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
          : 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'">
        {{ poll.allowMultiple ? 'Multiple Choice' : 'Single Choice' }}
      </span>
    </div>

    <div class="mt-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-colors">
      <!-- Header -->
      <div class="p-4 pb-3">
        <div class="flex items-start justify-between gap-2">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/40 shrink-0">
                <BarChart3 class="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </span>
              <span class="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Poll</span>
              <span v-if="poll.status === 'ended'"
                class="text-[9px] font-bold px-1.5 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 rounded-full">Ended</span>
            </div>
            <h3 class="text-sm font-bold text-gray-800 dark:text-gray-100 leading-snug">{{ poll.title }}</h3>
            <p class="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
              By {{ poll.createdByName }} · {{ fmtDate(poll.createdAt) }}
              <span v-if="poll.endsAt"> · Ends {{ fmtDate(poll.endsAt) }}</span>
            </p>
          </div>

          <!-- Admin Actions -->
          <div v-if="isAdmin && poll.status === 'active'" class="flex gap-1 shrink-0">
            <button @click="$emit('edit', poll)"
              class="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <Pencil class="w-3.5 h-3.5" />
            </button>
            <button @click="$emit('end', poll)"
              class="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:bg-amber-50 dark:hover:bg-amber-900/30 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              <CheckSquare class="w-3.5 h-3.5" />
            </button>
            <button @click="$emit('delete', poll)"
              class="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 dark:hover:text-red-400 transition-colors">
              <Trash2 class="w-3.5 h-3.5" />
            </button>
          </div>
          <div v-if="isAdmin && poll.status === 'ended'" class="flex gap-1 shrink-0">
            <button @click="$emit('reactivate', poll)"
              class="p-1.5 rounded-lg text-gray-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              <RotateCcw class="w-3.5 h-3.5" />
            </button>
            <button @click="$emit('delete', poll)"
              class="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 dark:hover:text-red-400 transition-colors">
              <Trash2 class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Options -->
      <div class="px-4 pb-4 flex flex-col gap-2">
        <button
          v-for="opt in poll.options" :key="opt.id"
          @click="handleVote(opt.id)"
          :disabled="isEnded || (hasVoted && !poll.allowMultiple)"
          class="w-full text-left relative overflow-hidden rounded-xl border transition-all duration-200"
          :class="[
            isSelected(opt.id)
              ? 'border-indigo-300 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30'
              : 'border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/40',
            !isEnded && (!hasVoted || poll.allowMultiple) ? 'active:scale-[0.98] cursor-pointer' : 'cursor-default'
          ]"
        >
          <!-- Vote progress bar behind -->
          <div
            class="absolute inset-y-0 left-0 transition-all duration-500 rounded-xl"
            :class="isSelected(opt.id) ? 'bg-indigo-100 dark:bg-indigo-900/40' : 'bg-gray-100 dark:bg-slate-800'"
            :style="{ width: votePercent(opt) + '%' }"
          ></div>

          <div class="relative flex items-center justify-between gap-2 px-3 py-2.5">
            <div class="flex items-center gap-2">
              <!-- Checkbox/Radio indicator -->
              <div class="shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors"
                :class="isSelected(opt.id)
                  ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-500 dark:bg-indigo-500'
                  : 'border-gray-300 dark:border-slate-600'">
                <div v-if="isSelected(opt.id)" class="w-1.5 h-1.5 rounded-full bg-white"></div>
              </div>
              <span class="text-xs font-bold text-gray-700 dark:text-gray-200">{{ opt.text }}</span>
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
              <span class="text-[10px] font-bold text-gray-500 dark:text-gray-400">{{ votePercent(opt) }}%</span>
              <span class="text-[10px] text-gray-400 dark:text-gray-500">({{ (opt.votes || []).length }})</span>
            </div>
          </div>
        </button>
      </div>

      <!-- Footer -->
      <div class="px-4 py-2.5 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 flex items-center justify-between transition-colors">
        <span class="text-[10px] text-gray-400 dark:text-gray-500">{{ totalVotes }} vote{{ totalVotes !== 1 ? 's' : '' }} total</span>
        <span v-if="hasVoted && poll.status === 'active'" class="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
          <CheckCircle class="w-3 h-3" /> Voted
        </span>
        <span v-if="isEnded" class="text-[10px] font-bold text-gray-400 dark:text-gray-500">Poll ended</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { BarChart3, Pencil, Trash2, CheckSquare, CheckCircle, RotateCcw } from 'lucide-vue-next'

const props = defineProps({
  poll: { type: Object, required: true },
  currentUserId: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
})

const emit = defineEmits(['vote', 'edit', 'delete', 'end', 'reactivate'])

const isEnded = computed(() => props.poll.status === 'ended')

const totalVotes = computed(() => {
  if (!props.poll.options) return 0
  const votedUsers = new Set()
  props.poll.options.forEach(opt => (opt.votes || []).forEach(uid => votedUsers.add(uid)))
  return votedUsers.size
})

const isSelected = (optionId) => {
  const opt = props.poll.options?.find(o => o.id === optionId)
  return opt ? (opt.votes || []).includes(props.currentUserId) : false
}

const hasVoted = computed(() =>
  props.poll.options?.some(opt => (opt.votes || []).includes(props.currentUserId))
)

const votePercent = (opt) => {
  if (totalVotes.value === 0) return 0
  return Math.round(((opt.votes || []).length / totalVotes.value) * 100)
}

const handleVote = (optionId) => {
  if (isEnded.value) return
  if (hasVoted.value && !props.poll.allowMultiple) return
  emit('vote', { alertId: props.poll.id, optionId, allowMultiple: props.poll.allowMultiple, options: props.poll.options })
}

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
</script>

<style scoped>
@reference "tailwindcss";
</style>
