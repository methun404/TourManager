<template>
  <div class="flex flex-col gap-3">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Expense Sub-Groups</h3>
      <button
        @click="showCreateForm = !showCreateForm"
        class="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors"
      >
        <Plus class="w-3.5 h-3.5" />
        New Group
      </button>
    </div>

    <!-- Create Form -->
    <Transition name="slide-down">
      <div v-if="showCreateForm" class="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/50 rounded-2xl flex flex-col gap-3">
        <div>
          <label class="block text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mb-1">Group Name</label>
          <input
            v-model="newGroupName"
            type="text"
            placeholder="e.g. Room A, Vegetarians, Day 2 Trip"
            class="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-700 rounded-xl text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <!-- Color picker -->
        <div>
          <label class="block text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mb-1.5">Color</label>
          <div class="flex gap-2 flex-wrap">
            <button
              v-for="color in colorOptions"
              :key="color"
              type="button"
              @click="newGroupColor = color"
              class="w-7 h-7 rounded-full border-2 transition-all"
              :style="{ background: color }"
              :class="newGroupColor === color ? 'border-gray-800 dark:border-white scale-110' : 'border-transparent'"
            />
          </div>
        </div>

        <!-- Member selector -->
        <div>
          <label class="block text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mb-1.5">
            Members ({{ newGroupMembers.length }} selected)
          </label>
          <div class="flex flex-col gap-1.5 max-h-40 overflow-y-auto">
            <button
              v-for="m in tourStore.activeMemberProfiles"
              :key="m.uid"
              type="button"
              @click="toggleNewMember(m.uid)"
              class="flex items-center gap-2 p-2 rounded-xl border transition-all text-left"
              :class="newGroupMembers.includes(m.uid)
                ? 'border-indigo-400 bg-indigo-50/80 dark:bg-indigo-900/30'
                : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-indigo-300'"
            >
              <div class="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold text-xs uppercase overflow-hidden shrink-0">
                <img v-if="m.avatar" :src="m.avatar" class="w-full h-full object-cover" />
                <span v-else>{{ m.name?.charAt(0) || 'U' }}</span>
              </div>
              <span class="text-xs font-bold text-gray-800 dark:text-gray-100 flex-1">{{ m.name }}</span>
              <div v-if="newGroupMembers.includes(m.uid)" class="w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                <svg class="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
              </div>
              <div v-else class="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-slate-600 shrink-0"></div>
            </button>
          </div>
        </div>

        <div class="flex gap-2">
          <button @click="showCreateForm = false; resetForm()" class="flex-1 py-2 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 font-bold text-xs rounded-xl hover:bg-gray-200 transition-colors">
            Cancel
          </button>
          <button
            @click="handleCreate"
            :disabled="creating || !newGroupName.trim() || newGroupMembers.length === 0"
            class="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl disabled:opacity-50 flex justify-center items-center gap-1 transition-colors"
          >
            <svg v-if="creating" class="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <span v-else>Create Group</span>
          </button>
        </div>
      </div>
    </Transition>

    <!-- Groups list -->
    <div v-if="expenseGroupStore.groups.length === 0 && !showCreateForm" class="flex flex-col items-center p-5 bg-gray-50 dark:bg-slate-900 border border-dashed border-gray-200 dark:border-slate-800 rounded-2xl transition-colors">
      <Users class="w-7 h-7 text-gray-300 dark:text-slate-600 mb-2" />
      <p class="text-xs text-gray-500 dark:text-gray-400">No sub-groups yet. Create one to split expenses among specific members.</p>
    </div>

    <div v-for="group in expenseGroupStore.groups" :key="group.id"
      class="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-3.5 shadow-sm transition-colors"
    >
      <div class="flex items-center gap-3 mb-2">
        <span class="w-3 h-3 rounded-full shrink-0" :style="{ background: group.color || '#6366f1' }"></span>
        <p class="text-sm font-bold text-gray-800 dark:text-gray-100 flex-1">{{ group.name }}</p>
        <button @click="deleteGroup(group)" class="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
          <Trash2 class="w-3.5 h-3.5" />
        </button>
      </div>
      <div class="flex flex-wrap gap-1.5">
        <span
          v-for="uid in group.members"
          :key="uid"
          class="px-2 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 text-[10px] font-bold rounded-full transition-colors"
        >
          {{ tourStore.getMemberName(uid) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus, Users, Trash2 } from 'lucide-vue-next'
import { useTourStore } from '../../stores/tourStore'
import { useExpenseGroupStore } from '../../stores/expenseGroupStore'
import { useAuthStore } from '../../stores/authStore'
import { useToastStore } from '../../stores/toastStore'

const tourStore = useTourStore()
const expenseGroupStore = useExpenseGroupStore()
const authStore = useAuthStore()
const toastStore = useToastStore()

const showCreateForm = ref(false)
const creating = ref(false)
const newGroupName = ref('')
const newGroupColor = ref('#6366f1')
const newGroupMembers = ref([])

const colorOptions = [
  '#6366f1', '#3b82f6', '#10b981', '#f59e0b',
  '#ef4444', '#ec4899', '#8b5cf6', '#06b6d4',
]

const toggleNewMember = (uid) => {
  const idx = newGroupMembers.value.indexOf(uid)
  if (idx >= 0) newGroupMembers.value.splice(idx, 1)
  else newGroupMembers.value.push(uid)
}

const resetForm = () => {
  newGroupName.value = ''
  newGroupColor.value = '#6366f1'
  newGroupMembers.value = []
}

const handleCreate = async () => {
  if (!newGroupName.value.trim() || newGroupMembers.value.length === 0) return
  creating.value = true
  try {
    await expenseGroupStore.createGroup({
      tourId: tourStore.tourId,
      name: newGroupName.value.trim(),
      members: [...newGroupMembers.value],
      color: newGroupColor.value,
      createdBy: authStore.user.uid,
      createdByName: authStore.getUserName,
    })
    toastStore.addToast(`Group "${newGroupName.value}" created!`, 'success')
    resetForm()
    showCreateForm.value = false
  } catch (err) {
    console.error('Create group error:', err)
    toastStore.addToast('Failed to create group.', 'error')
  } finally {
    creating.value = false
  }
}

const deleteGroup = async (group) => {
  if (!confirm(`Delete group "${group.name}"?`)) return
  try {
    await expenseGroupStore.deleteGroup(group.id)
    toastStore.addToast(`Group "${group.name}" deleted.`, 'info')
  } catch (err) {
    toastStore.addToast('Failed to delete group.', 'error')
  }
}
</script>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}
.slide-down-enter-from, .slide-down-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-8px);
}
.slide-down-enter-to, .slide-down-leave-from {
  opacity: 1;
  max-height: 600px;
}
</style>
