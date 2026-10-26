<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-5">

    <!-- Title -->
    <div>
      <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Expense Title</label>
      <input
        v-model="form.title"
        type="text"
        required
        placeholder="e.g. Bus ticket to Cox's Bazar"
        class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 outline-none text-gray-800 dark:text-gray-100 text-sm transition-colors"
      />
    </div>

    <!-- Amount -->
    <div>
      <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Amount (৳)</label>
      <div class="relative">
        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">৳</span>
        <input
          v-model.number="form.amount"
          type="number"
          required
          min="1"
          placeholder="0.00"
          class="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 outline-none text-gray-800 dark:text-gray-100 font-bold text-lg transition-colors"
        />
      </div>
    </div>

    <!-- Category -->
    <div>
      <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Category</label>
      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="cat in displayCategories"
          :key="cat.id"
          type="button"
          @click="form.category = cat.id"
          class="flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200"
          :class="[
            form.category === cat.id
              ? `${cat.activeBg} border-transparent shadow-sm scale-105`
              : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 text-gray-400 dark:text-gray-500'
          ]"
        >
          <component
            :is="getIcon(cat.icon)"
            class="w-6 h-6 mb-1 transition-colors"
            :class="form.category === cat.id ? cat.activeText : 'text-gray-400 dark:text-gray-500'"
          />
          <span
            class="text-[10px] font-bold transition-colors leading-tight text-center"
            :class="form.category === cat.id ? cat.activeText : 'text-gray-500 dark:text-gray-400'"
          >
            {{ cat.label }}
          </span>
        </button>
      </div>
    </div>

    <!-- Split Mode — only for admin or if not personal -->
    <div v-if="!forcePersonal && (isAdmin || tourStore.allowMemberExpenseRequest)">
      
      <!-- Personal toggle -->
      <div class="flex items-center justify-between p-4 bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-xl transition-colors mb-3">
        <div class="flex flex-col">
          <span class="text-sm font-bold text-gray-800 dark:text-gray-100">Personal Expense?</span>
          <span class="text-[10px] text-gray-500 dark:text-gray-400">Hide this from group calculations</span>
        </div>
        <button
          type="button"
          @click="form.isPersonal = !form.isPersonal; if(form.isPersonal) form.splitMode = 'all'"
          class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none"
          :class="form.isPersonal ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-gray-200 dark:bg-slate-700'"
        >
          <span
            class="inline-block h-4 w-4 transform rounded-full bg-white transition duration-300 shadow-sm"
            :class="form.isPersonal ? 'translate-x-6' : 'translate-x-1'"
          />
        </button>
      </div>

      <!-- Split Mode selector — only for group expense when admin -->
      <div v-if="!form.isPersonal && isAdmin" class="flex flex-col gap-2">
        <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Split Among</label>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="mode in splitModes"
            :key="mode.key"
            type="button"
            @click="form.splitMode = mode.key; resetSplitSelection()"
            class="py-2 px-2 rounded-xl border text-xs font-bold transition-all"
            :class="form.splitMode === mode.key
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:border-blue-300'"
          >
            {{ mode.label }}
          </button>
        </div>

        <!-- Expense Group selector -->
        <div v-if="form.splitMode === 'group'" class="mt-1">
          <div v-if="expenseGroupStore.groups.length === 0" class="text-xs text-gray-400 dark:text-gray-500 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl text-center">
            No expense groups yet. Create one from the Admin dashboard.
          </div>
          <div v-else class="flex flex-col gap-2">
            <button
              v-for="g in expenseGroupStore.groups"
              :key="g.id"
              type="button"
              @click="form.selectedGroupId = g.id"
              class="flex items-center gap-2 p-3 rounded-xl border transition-all text-left"
              :class="form.selectedGroupId === g.id
                ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/30'
                : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-blue-300'"
            >
              <span class="w-3 h-3 rounded-full shrink-0" :style="{ background: g.color || '#6366f1' }"></span>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-bold text-gray-800 dark:text-gray-100">{{ g.name }}</p>
                <p class="text-[10px] text-gray-500 dark:text-gray-400">{{ g.members.length }} members</p>
              </div>
              <div v-if="form.selectedGroupId === g.id" class="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                <svg class="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
              </div>
            </button>
          </div>
        </div>

        <!-- Custom member selector -->
        <div v-if="form.splitMode === 'custom'" class="mt-1">
          <p class="text-[10px] text-gray-500 dark:text-gray-400 mb-2">Select members to split with:</p>
          <div class="flex flex-col gap-2 max-h-48 overflow-y-auto">
            <button
              v-for="m in tourStore.activeMemberProfiles"
              :key="m.uid"
              type="button"
              @click="toggleMember(m.uid)"
              class="flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left"
              :class="form.selectedMemberIds.includes(m.uid)
                ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/30'
                : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-blue-300'"
            >
              <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold text-sm uppercase overflow-hidden shrink-0">
                <img v-if="m.avatar" :src="m.avatar" class="w-full h-full object-cover" />
                <span v-else>{{ m.name?.charAt(0) || 'U' }}</span>
              </div>
              <span class="text-xs font-bold text-gray-800 dark:text-gray-100 flex-1">{{ m.name }}</span>
              <div v-if="form.selectedMemberIds.includes(m.uid)" class="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                <svg class="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
              </div>
              <div v-else class="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-slate-600 shrink-0"></div>
            </button>
          </div>
          <p v-if="form.selectedMemberIds.length > 0" class="text-[10px] text-blue-600 dark:text-blue-400 mt-1.5 font-bold">
            ৳{{ form.amount ? Math.round(form.amount / form.selectedMemberIds.length) : 0 }} per person ({{ form.selectedMemberIds.length }} selected)
          </p>
        </div>

        <!-- Per-person preview for all/group mode -->
        <div v-if="form.splitMode === 'all' && form.amount" class="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
          ৳{{ Math.round(form.amount / (tourStore.activeMembers.length || 1)) }} per person ({{ tourStore.activeMembers.length }} active members)
        </div>
      </div>
    </div>

    <!-- Notice for members: group expense goes for approval -->
    <div v-if="!form.isPersonal && !isAdmin" class="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800/50 rounded-xl transition-colors">
      <span class="text-amber-500 text-base leading-none mt-0.5">⏳</span>
      <p class="text-xs text-amber-700 dark:text-amber-400">
        This group expense will be sent to the <strong>Admin for approval</strong>. It will appear in the expense list only after approval.
      </p>
    </div>

    <!-- Note -->
    <div>
      <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Note (Optional)</label>
      <input
        v-model="form.note"
        type="text"
        placeholder="e.g. Shared dinner at Cox's Bazar"
        class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 outline-none text-gray-800 dark:text-gray-100 text-sm transition-colors"
      />
    </div>

    <!-- Buttons -->
    <div class="flex gap-3 mt-2 pt-4 border-t border-gray-100 dark:border-slate-800 transition-colors">
      <button
        type="button"
        @click="$emit('cancel')"
        class="flex-1 py-3 px-4 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 font-bold rounded-xl transition-colors active:scale-95"
      >
        Cancel
      </button>
      <button
        type="submit"
        :disabled="submitting || !canSubmit"
        class="flex-1 py-3 px-4 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 flex justify-center items-center gap-2 disabled:opacity-60"
        :class="!form.isPersonal && !isAdmin
          ? 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-orange-200 dark:shadow-orange-900/20'
          : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-200 dark:shadow-blue-900/20'"
      >
        {{ submitting ? 'Saving...' : (!form.isPersonal && !isAdmin ? '📤 Send for Approval' : 'Save Expense') }}
      </button>
    </div>

  </form>
</template>

<script setup>
import { reactive, computed, ref } from 'vue'
import { Utensils, Bus, BedDouble, Ticket, ShoppingBag, Receipt, Coffee, Zap } from 'lucide-vue-next'
import { useTourStore } from '../../stores/tourStore'
import { useAuthStore } from '../../stores/authStore'
import { useExpenseGroupStore } from '../../stores/expenseGroupStore'

const emit = defineEmits(['submit-expense', 'cancel'])
const props = defineProps({
  submitting: { type: Boolean, default: false },
  forcePersonal: { type: Boolean, default: false }
})

const tourStore = useTourStore()
const authStore = useAuthStore()
const expenseGroupStore = useExpenseGroupStore()
const isAdmin = computed(() => authStore.userProfile.role === 'admin')

const splitModes = [
  { key: 'all', label: 'All Members' },
  { key: 'group', label: 'Sub-Group' },
  { key: 'custom', label: 'Custom' },
]

const defaultCategories = [
  { id: 'food', label: 'Food', icon: 'Utensils', activeBg: 'bg-orange-100 dark:bg-orange-900/40', activeText: 'text-orange-600 dark:text-orange-400' },
  { id: 'transport', label: 'Transport', icon: 'Bus', activeBg: 'bg-blue-100 dark:bg-blue-900/40', activeText: 'text-blue-600 dark:text-blue-400' },
  { id: 'hotel', label: 'Hotel', icon: 'BedDouble', activeBg: 'bg-purple-100 dark:bg-purple-900/40', activeText: 'text-purple-600 dark:text-purple-400' },
  { id: 'activity', label: 'Activity', icon: 'Ticket', activeBg: 'bg-emerald-100 dark:bg-emerald-900/40', activeText: 'text-emerald-600 dark:text-emerald-400' },
  { id: 'shopping', label: 'Shopping', icon: 'ShoppingBag', activeBg: 'bg-pink-100 dark:bg-pink-900/40', activeText: 'text-pink-600 dark:text-pink-400' },
  { id: 'other', label: 'Other', icon: 'Receipt', activeBg: 'bg-gray-200 dark:bg-slate-800', activeText: 'text-gray-700 dark:text-gray-300' }
]

const iconMap = { Utensils, Bus, BedDouble, Ticket, ShoppingBag, Receipt, Coffee, Zap }
const getIcon = (name) => iconMap[name] || Receipt

const displayCategories = computed(() => {
  return tourStore.currentTour?.categories?.length
    ? tourStore.currentTour.categories
    : defaultCategories
})

const form = reactive({
  title: '',
  amount: null,
  category: 'food',
  note: '',
  isPersonal: props.forcePersonal || (!isAdmin.value && !tourStore.allowMemberExpenseRequest),
  splitMode: 'all',         // 'all' | 'group' | 'custom'
  selectedGroupId: null,    // for group mode
  selectedMemberIds: [],    // for custom mode
})

const toggleMember = (uid) => {
  const idx = form.selectedMemberIds.indexOf(uid)
  if (idx >= 0) {
    form.selectedMemberIds.splice(idx, 1)
  } else {
    form.selectedMemberIds.push(uid)
  }
}

const resetSplitSelection = () => {
  form.selectedGroupId = null
  form.selectedMemberIds = []
}

// Can submit validation
const canSubmit = computed(() => {
  if (!form.title || !form.amount) return false
  if (form.isPersonal || !isAdmin.value) return true
  if (form.splitMode === 'group') return !!form.selectedGroupId
  if (form.splitMode === 'custom') return form.selectedMemberIds.length > 0
  return true
})

/**
 * Build the splitAmong array based on chosen mode
 */
const buildSplitAmong = () => {
  if (form.isPersonal) return null // personal = no group split

  if (form.splitMode === 'group' && form.selectedGroupId) {
    const members = expenseGroupStore.getGroupMembers(form.selectedGroupId)
    return members.length > 0 ? members : tourStore.activeMembers
  }

  if (form.splitMode === 'custom' && form.selectedMemberIds.length > 0) {
    return [...form.selectedMemberIds]
  }

  // 'all' mode: use all active (non-paused) members
  return tourStore.activeMembers.length > 0 ? tourStore.activeMembers : null
}

const handleSubmit = () => {
  const splitAmong = buildSplitAmong()

  const expenseData = {
    title: form.title,
    amount: form.amount,
    category: form.category,
    note: form.note,
    isPersonal: form.isPersonal,
    date: new Date().toISOString(),
    splitAmong,
    groupId: form.splitMode === 'group' ? form.selectedGroupId : null,
  }

  emit('submit-expense', expenseData)

  // Reset form
  form.title = ''
  form.amount = null
  form.category = displayCategories.value[0]?.id || 'food'
  form.note = ''
  form.isPersonal = props.forcePersonal || (!isAdmin.value && !tourStore.allowMemberExpenseRequest)
  form.splitMode = 'all'
  form.selectedGroupId = null
  form.selectedMemberIds = []
}
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>