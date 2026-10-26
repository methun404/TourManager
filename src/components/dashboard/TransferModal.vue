<template>
  <ActionModal :isOpen="isOpen" title="Transfer Balance" @close="$emit('close')">
    <div class="flex flex-col gap-4">

      <!-- From member info -->
      <div class="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl flex items-center gap-3 transition-colors">
        <div class="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold uppercase overflow-hidden shrink-0">
          <img v-if="fromMember?.avatar" :src="fromMember.avatar" class="w-full h-full object-cover" />
          <span v-else>{{ fromMember?.name?.charAt(0) || 'U' }}</span>
        </div>
        <div class="flex-1">
          <p class="text-sm font-bold text-gray-800 dark:text-gray-100">{{ fromMember?.name }}</p>
          <p class="text-[10px] text-gray-500 dark:text-gray-400">
            Available balance: 
            <span :class="senderBalance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'">
              {{ senderBalance >= 0 ? '+' : '' }}৳{{ fmt(senderBalance) }}
            </span>
          </p>
        </div>
        <ArrowRight class="w-4 h-4 text-gray-400" />
      </div>

      <!-- To member selector -->
      <div>
        <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Transfer To</label>
        <div class="flex flex-col gap-2 max-h-48 overflow-y-auto">
          <button
            v-for="m in otherMembers"
            :key="m.uid"
            type="button"
            @click="selectedToMember = m"
            class="flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left"
            :class="selectedToMember?.uid === m.uid
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/30'
              : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-blue-300'"
          >
            <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold uppercase overflow-hidden shrink-0">
              <img v-if="m.avatar" :src="m.avatar" class="w-full h-full object-cover" />
              <span v-else>{{ m.name?.charAt(0) || 'U' }}</span>
            </div>
            <span class="text-xs font-bold text-gray-800 dark:text-gray-100 flex-1">{{ m.name }}</span>
            <div v-if="selectedToMember?.uid === m.uid" class="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center">
              <svg class="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
            </div>
          </button>
        </div>
      </div>

      <!-- Amount -->
      <div>
        <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Amount (৳)</label>
        <div class="relative">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">৳</span>
          <input
            v-model.number="amount"
            type="number"
            min="1"
            :max="Math.max(0, senderBalance)"
            placeholder="0.00"
            class="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 outline-none text-gray-800 dark:text-gray-100 font-bold text-lg transition-colors"
          />
        </div>
        <p v-if="amount > senderBalance" class="text-[10px] text-red-500 mt-1">⚠ Amount exceeds available balance</p>
      </div>

      <!-- Note -->
      <div>
        <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Note (Optional)</label>
        <input
          v-model="note"
          type="text"
          placeholder="e.g. Paying for dinner"
          class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 outline-none text-gray-800 dark:text-gray-100 text-sm transition-colors"
        />
      </div>

      <!-- Approval notice -->
      <div v-if="tourStore.requireTransferApproval" class="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800/50 rounded-xl">
        <span class="text-amber-500 text-sm mt-0.5">⏳</span>
        <p class="text-xs text-amber-700 dark:text-amber-400">This transfer needs <strong>Admin approval</strong> before it's applied.</p>
      </div>
      <div v-else class="flex items-start gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/50 rounded-xl">
        <span class="text-emerald-500 text-sm mt-0.5">✓</span>
        <p class="text-xs text-emerald-700 dark:text-emerald-400">Transfer will be applied <strong>immediately</strong>.</p>
      </div>

      <!-- Action buttons -->
      <div class="flex gap-3 pt-2 border-t border-gray-100 dark:border-slate-800">
        <button @click="$emit('close')" class="flex-1 py-3 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 font-bold rounded-xl transition-colors">
          Cancel
        </button>
        <button
          @click="handleTransfer"
          :disabled="loading || !canTransfer"
          class="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg shadow-blue-200 dark:shadow-blue-900/30 transition-all"
        >
          <svg v-if="loading" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <span v-else>Send Transfer</span>
        </button>
      </div>
    </div>
  </ActionModal>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ArrowRight } from 'lucide-vue-next'
import { useTourStore } from '../../stores/tourStore'
import { useTransferStore } from '../../stores/transferStore'
import { useToastStore } from '../../stores/toastStore'
import ActionModal from '../common/ActionModal.vue'

const props = defineProps({
  isOpen: Boolean,
  fromMember: Object,      // { uid, name, avatar }
  senderBalance: { type: Number, default: 0 },
})
const emit = defineEmits(['close', 'done'])

const tourStore = useTourStore()
const transferStore = useTransferStore()
const toastStore = useToastStore()

const selectedToMember = ref(null)
const amount = ref(null)
const note = ref('')
const loading = ref(false)

const otherMembers = computed(() =>
  tourStore.activeMemberProfiles.filter(m => m.uid !== props.fromMember?.uid)
)

const canTransfer = computed(() =>
  selectedToMember.value &&
  amount.value > 0 &&
  amount.value <= props.senderBalance
)

const handleTransfer = async () => {
  if (!canTransfer.value) return
  loading.value = true
  try {
    await transferStore.sendTransfer({
      tourId: tourStore.tourId,
      fromMemberId: props.fromMember.uid,
      fromMemberName: props.fromMember.name,
      toMemberId: selectedToMember.value.uid,
      toMemberName: selectedToMember.value.name,
      amount: amount.value,
      note: note.value,
      requireApproval: tourStore.requireTransferApproval,
    })
    const msg = tourStore.requireTransferApproval
      ? `Transfer request sent to Admin for approval.`
      : `৳${fmt(amount.value)} sent to ${selectedToMember.value.name}!`
    toastStore.addToast(msg, 'success')
    amount.value = null
    note.value = ''
    selectedToMember.value = null
    emit('done')
    emit('close')
  } catch (err) {
    console.error('Transfer error:', err)
    toastStore.addToast('Transfer failed. Try again.', 'error')
  } finally {
    loading.value = false
  }
}

const fmt = (n) => Number(n || 0).toLocaleString('en-IN')
</script>
