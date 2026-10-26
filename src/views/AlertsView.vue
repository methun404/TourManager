<template>
  <div class="px-4 py-2 sm:px-6 animate-fade-in flex flex-col gap-4 pb-4">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-extrabold text-gray-800 dark:text-gray-100">Alerts</h2>
        <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Polls, announcements & reminders</p>
      </div>
      <button v-if="isAdmin" @click="openCreate"
        class="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-indigo-300 dark:shadow-indigo-900/30 transition-all active:scale-95">
        <Plus class="w-4 h-4" />
        New Alert
      </button>
    </div>

    <!-- Tab Navigation -->
    <div class="flex gap-1 p-1 bg-gray-100 dark:bg-slate-800 rounded-xl transition-colors">
      <button @click="activeTab = 'active'"
        class="flex-1 py-2 text-xs font-bold rounded-lg transition-all"
        :class="activeTab === 'active'
          ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'">
        Active
        <span v-if="alertStore.activeAlerts.length > 0"
          class="ml-1 px-1.5 py-0.5 text-[9px] rounded-full"
          :class="activeTab === 'active' ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300' : 'bg-gray-200 dark:bg-slate-700 text-gray-500'">
          {{ alertStore.activeAlerts.length }}
        </span>
      </button>
      <button @click="activeTab = 'history'"
        class="flex-1 py-2 text-xs font-bold rounded-lg transition-all"
        :class="activeTab === 'history'
          ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'">
        History
        <span v-if="alertStore.endedAlerts.length > 0"
          class="ml-1 px-1.5 py-0.5 text-[9px] rounded-full bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-400">
          {{ alertStore.endedAlerts.length }}
        </span>
      </button>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="alertStore.isLoading" class="flex flex-col gap-4">
      <div v-for="i in 3" :key="i" class="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 h-28 animate-pulse transition-colors">
        <div class="h-3 bg-gray-100 dark:bg-slate-800 rounded w-1/3 mb-3"></div>
        <div class="h-4 bg-gray-100 dark:bg-slate-800 rounded w-2/3 mb-2"></div>
        <div class="h-3 bg-gray-100 dark:bg-slate-800 rounded w-1/2"></div>
      </div>
    </div>

    <!-- Active Tab -->
    <template v-else-if="activeTab === 'active'">
      <div v-if="alertStore.activeAlerts.length === 0"
        class="flex flex-col items-center justify-center p-10 bg-gray-50 dark:bg-slate-900 border border-dashed border-gray-200 dark:border-slate-800 rounded-2xl transition-colors">
        <BellOff class="w-10 h-10 text-gray-200 dark:text-slate-700 mb-3" />
        <p class="text-sm font-bold text-gray-400 dark:text-gray-500">No active alerts</p>
        <p v-if="isAdmin" class="text-xs text-gray-400 dark:text-gray-500 mt-1">Tap "New Alert" to get started</p>
      </div>

      <div v-else class="flex flex-col gap-5">
        <template v-for="alert in alertStore.activeAlerts" :key="alert.id">
          <PollCard
            v-if="alert.type === 'poll'"
            :poll="alert"
            :currentUserId="authStore.user?.uid"
            :isAdmin="isAdmin"
            @vote="handleVote"
            @edit="openEdit(alert)"
            @delete="handleDelete(alert)"
            @end="handleEnd(alert)"
            @reactivate="handleReactivate(alert)"
          />
          <AnnouncementCard
            v-else
            :alert="alert"
            :isAdmin="isAdmin"
            @edit="openEdit(alert)"
            @delete="handleDelete(alert)"
            @end="handleEnd(alert)"
            @reactivate="handleReactivate(alert)"
          />
        </template>
      </div>
    </template>

    <!-- History Tab -->
    <template v-else>
      <div v-if="alertStore.endedAlerts.length === 0"
        class="flex flex-col items-center justify-center p-10 bg-gray-50 dark:bg-slate-900 border border-dashed border-gray-200 dark:border-slate-800 rounded-2xl transition-colors">
        <History class="w-10 h-10 text-gray-200 dark:text-slate-700 mb-3" />
        <p class="text-sm font-bold text-gray-400 dark:text-gray-500">No history yet</p>
      </div>

      <div v-else class="flex flex-col gap-5">
        <template v-for="alert in alertStore.endedAlerts" :key="alert.id">
          <PollCard
            v-if="alert.type === 'poll'"
            :poll="alert"
            :currentUserId="authStore.user?.uid"
            :isAdmin="isAdmin"
            @vote="handleVote"
            @edit="openEdit(alert)"
            @delete="handleDelete(alert)"
            @end="handleEnd(alert)"
            @reactivate="handleReactivate(alert)"
          />
          <AnnouncementCard
            v-else
            :alert="alert"
            :isAdmin="isAdmin"
            @edit="openEdit(alert)"
            @delete="handleDelete(alert)"
            @end="handleEnd(alert)"
            @reactivate="handleReactivate(alert)"
          />
        </template>
      </div>
    </template>

    <!-- Create/Edit Modal -->
    <CreateAlertModal
      :isOpen="isModalOpen"
      :editingAlert="editingAlert"
      @close="closeModal"
      @submit="handleSubmit"
    />

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Plus, BellOff, History } from 'lucide-vue-next'
import { useAlertStore } from '../stores/alertStore'
import { useAuthStore } from '../stores/authStore'
import { useToastStore } from '../stores/toastStore'

import PollCard from '../components/alerts/PollCard.vue'
import AnnouncementCard from '../components/alerts/AnnouncementCard.vue'
import CreateAlertModal from '../components/alerts/CreateAlertModal.vue'

const alertStore = useAlertStore()
const authStore = useAuthStore()
const toastStore = useToastStore()

const activeTab = ref('active')
const isModalOpen = ref(false)
const editingAlert = ref(null)

const isAdmin = computed(() => authStore.userProfile.role === 'admin')

const openCreate = () => {
  editingAlert.value = null
  isModalOpen.value = true
}

const openEdit = (alert) => {
  editingAlert.value = alert
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  editingAlert.value = null
}

const handleSubmit = async ({ payload, isEditing, id }) => {
  const tourId = authStore.userProfile.currentTourId
  if (!tourId) return

  try {
    if (isEditing && id) {
      await alertStore.updateAlert(id, payload)
      toastStore.addToast('Alert updated!', 'success')
    } else {
      await alertStore.createAlert({
        ...payload,
        tourId,
        createdBy: authStore.user.uid,
        createdByName: authStore.getUserName,
      })
      toastStore.addToast('Alert created! Members will be notified.', 'success')
    }
    closeModal()
  } catch (err) {
    console.error('Alert error:', err)
    toastStore.addToast('Something went wrong. Please try again.', 'error')
  }
}

const handleVote = async ({ alertId, optionId, allowMultiple, options }) => {
  const uid = authStore.user?.uid
  if (!uid) return
  try {
    await alertStore.castVote(alertId, optionId, uid, allowMultiple, options)
  } catch (err) {
    console.error('Vote error:', err)
    toastStore.addToast('Failed to cast vote.', 'error')
  }
}

const handleDelete = async (alert) => {
  if (!confirm(`Delete "${alert.title}"? This cannot be undone.`)) return
  try {
    await alertStore.deleteAlert(alert.id)
    toastStore.addToast('Alert deleted.', 'info')
  } catch (err) {
    toastStore.addToast('Failed to delete.', 'error')
  }
}

const handleEnd = async (alert) => {
  try {
    await alertStore.endAlert(alert.id)
    toastStore.addToast('Alert moved to history.', 'info')
  } catch (err) {
    toastStore.addToast('Failed to end alert.', 'error')
  }
}

const handleReactivate = async (alert) => {
  try {
    await alertStore.reactivateAlert(alert.id)
    toastStore.addToast('Alert reactivated!', 'success')
  } catch (err) {
    toastStore.addToast('Failed to reactivate.', 'error')
  }
}
</script>

<style scoped>
@reference "tailwindcss";
</style>
