<template>
  <div class="min-h-screen font-sans">
    <SyncBanner />
    <ToastNotification />
    <TopHeader 
      v-if="!isWelcomePage"
      :title="pageTitle" 
      @invite-members="handleInvite" 
    />

    <main :class="isWelcomePage ? '' : 'pt-[calc(3.5rem+env(safe-area-inset-top))] pb-[calc(5rem+env(safe-area-inset-bottom))]'">
      <div :class="isWelcomePage ? '' : 'max-w-md mx-auto min-h-[calc(100vh-8.5rem)] relative overflow-hidden'">
        
        <router-view v-slot="{ Component, route }">
          <transition name="page" mode="out-in">
            <component :is="Component" :key="route.fullPath" />
          </transition>
        </router-view>

      </div>
    </main>

    <BottomNav 
      v-if="!isWelcomePage"
      @open-add-modal="isAddExpenseModalOpen = true" 
    />

    <ActionModal 
      :isOpen="isAddExpenseModalOpen" 
      :title="addExpenseModalTitle" 
      @close="isAddExpenseModalOpen = false"
    >
      <AddExpenseForm 
        :submitting="isSavingExpense"
        @cancel="isAddExpenseModalOpen = false" 
        @submit-expense="handleSaveExpense" 
      />
    </ActionModal>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Components Import
import TopHeader from '../components/common/TopHeader.vue'
import BottomNav from '../components/common/BottomNav.vue'
import ActionModal from '../components/common/ActionModal.vue'
import ToastNotification from '../components/common/ToastNotification.vue'
import SyncBanner from '../components/common/SyncBanner.vue'
import AddExpenseForm from '../components/expenses/AddExpenseForm.vue'
import { useToastStore } from '../stores/toastStore'
import { useAuthStore } from '../stores/authStore'
import { useTourStore } from '../stores/tourStore'
import { useExpenseStore } from '../stores/expenseStore'
import { useFundRequestStore } from '../stores/fundRequestStore'
import { useContributionStore } from '../stores/contributionStore'
import { useExpenseRequestStore } from '../stores/expenseRequestStore'
import { useAlertStore } from '../stores/alertStore'
import { useJoinRequestStore } from '../stores/joinRequestStore'
import { useTransferStore } from '../stores/transferStore'
import { useExpenseGroupStore } from '../stores/expenseGroupStore'
import { useAuditStore } from '../stores/auditStore'
import { firestore } from '../services/firebase'
import { collection, addDoc } from 'firebase/firestore'
import { watchEffect, watch, onMounted } from 'vue'
import { useNotification } from '../composables/useNotification'

const route = useRoute()
const authStore = useAuthStore()
const toastStore = useToastStore()

// Hide header/bottom nav on Welcome page
const isWelcomePage = computed(() => route.name === 'WelcomeGroup')
const tourStore = useTourStore()
const expenseStore = useExpenseStore()
const fundRequestStore = useFundRequestStore()
const contributionStore = useContributionStore()
const expenseRequestStore = useExpenseRequestStore()
const alertStore = useAlertStore()
const joinRequestStore = useJoinRequestStore()
const transferStore = useTransferStore()
const expenseGroupStore = useExpenseGroupStore()
const auditStore = useAuditStore()
const router = useRouter()
const { requestPermission, showNotification } = useNotification()

onMounted(async () => {
  // Request notification permission when app opens
  await requestPermission()
})

// 1. Initialize main tour listeners when tour ID changes
watch(() => authStore.userProfile.currentTourId, (tourId) => {
  if (tourId) {
    const uid = authStore.user?.uid
    tourStore.initTourListener(tourId)
    expenseStore.initExpenseListener(tourId, uid)
    fundRequestStore.initRequestsListener(tourId)
    contributionStore.initContributionListener(tourId)
    expenseRequestStore.initListener(tourId)
    alertStore.initListener(tourId)
    transferStore.initTransferListener(tourId)
    expenseGroupStore.initGroupListener(tourId)
    auditStore.initAuditListener(tourId)
  }
}, { immediate: true })

// 2. Initialize user join requests listener when UID is available
watch(() => authStore.user?.uid, (uid) => {
  if (uid) {
    joinRequestStore.initUserListener(uid)
  }
}, { immediate: true })

// 3. Initialize admin join requests listener when user becomes admin of current tour
const isAdmin = computed(() => {
  const tourId = authStore.userProfile.currentTourId
  const uid = authStore.user?.uid
  return tourId && tourStore.currentTour?.adminId === uid
})

watch(isAdmin, (adminStatus) => {
  if (adminStatus) {
    const tourId = authStore.userProfile.currentTourId
    joinRequestStore.initAdminListener(tourId)
  }
}, { immediate: true })

// Watch for new alerts and notify via toast AND device notification
let prevAlertCount = 0
watch(() => alertStore.activeAlerts.length, (newCount) => {
  if (prevAlertCount > 0 && newCount > prevAlertCount) {
    const newest = alertStore.activeAlerts[0]
    if (newest) {
      const typeLabel = newest.type === 'poll' ? '📊 New Poll' : newest.type === 'reminder' ? '⏰ Reminder' : '📢 Announcement'
      const title = `${typeLabel}: ${newest.title}`
      
      // Show in-app toast
      toastStore.addToast(title, 'info', 5000)
      
      // Show device notification
      showNotification(title, {
        body: newest.message || 'Tap to view details in TureManager',
        tag: 'new-alert',
      })
    }
  }
  prevAlertCount = newCount
}, { immediate: false })

// Auto-join watcher: if user's join request gets approved, join them to the tour
watch(() => joinRequestStore.myApprovedRequest, async (approvedReq) => {
  if (!approvedReq) return
  
  // If user is already in a tour
  if (authStore.userProfile.currentTourId) {
    // If they are in the same tour as the approved request, just mark it completed
    if (authStore.userProfile.currentTourId === approvedReq.tourId) {
      await joinRequestStore.markRequestCompleted(approvedReq.id)
    }
    return
  }
  
  try {
    await authStore.joinTour(approvedReq.tourId)
    await joinRequestStore.markRequestCompleted(approvedReq.id)
    tourStore.initTourListener(approvedReq.tourId)
    toastStore.addToast(`🎉 Joined "${approvedReq.tourName}"!`, 'success')
    router.push('/dashboard')
  } catch (e) {
    console.error('Auto-join failed:', e)
  }
}, { immediate: true })


// State for Modal
const isAddExpenseModalOpen = ref(false)
const isSavingExpense = ref(false)

// Dynamic modal title based on role and setting
const addExpenseModalTitle = computed(() => {
  if (authStore.userProfile.role === 'admin') return 'Add Expense'
  if (tourStore.allowMemberExpenseRequest) return 'Request Expense'
  return 'Add Personal Expense'
})

// Dynamic Page Title based on Router Meta
const pageTitle = computed(() => {
  return route.meta.title || 'Tour Manager'
})

// Invite Member Event Handler (From TopHeader)
const handleInvite = async () => {
  const code = tourStore.inviteCode
  if (!code) return
  const message = `Join my tour "${tourStore.tourName}" on Tour Manager! Invite code: ${code}`
  try {
    if (navigator.share) {
      await navigator.share({ title: 'Join My Tour', text: message })
    } else {
      await navigator.clipboard.writeText(message)
      toastStore.addToast('Invite message copied to clipboard!', 'success')
    }
  } catch (e) {
    if (e.name !== 'AbortError') {
      toastStore.addToast(`Invite Code: ${code}`, 'info')
    }
  }
}

// Save Expense Handler
// Admin: saves directly to 'expenses'
// Member (group expense): saves to 'expense_requests' for approval
// Anyone (personal expense): saves directly to 'expenses'
const handleSaveExpense = async (expenseData) => {
  if (!authStore.userProfile.currentTourId) {
    toastStore.addToast("You are not in an active tour.", 'warning')
    return
  }

  isSavingExpense.value = true
  try {
    const isAdmin = authStore.userProfile.role === 'admin'
    const isPersonal = expenseData.isPersonal || false
    const isOffline = !navigator.onLine

    const payload = {
      title: expenseData.title,
      amount: expenseData.amount,
      category: expenseData.category,
      note: expenseData.note || '',
      isPersonal,
      date: expenseData.date || new Date().toISOString(),
      tourId: authStore.userProfile.currentTourId,
      paidBy: authStore.user.uid,
      paidByName: authStore.getUserName,
      splitAmong: expenseData.splitAmong || null,
      groupId: expenseData.groupId || null,
      createdAt: new Date().toISOString()
    }

    let promise;
    if (isPersonal || isAdmin) {
      promise = addDoc(collection(firestore, "expenses"), payload)
    } else {
      promise = addDoc(collection(firestore, "expense_requests"), {
        ...payload,
        status: 'pending'
      })
    }

    isAddExpenseModalOpen.value = false
    
    if (isOffline) {
      toastStore.addToast("Saved locally (Offline). Will sync when online.", 'info')
    } else {
      await promise;
      toastStore.addToast(isAdmin || isPersonal ? "Expense saved!" : "Expense request sent!", 'success')
    }
  } catch (error) {
    console.error("Error saving expense:", error)
    toastStore.addToast("Failed to save expense. Please try again.", 'error')
  } finally {
    isSavingExpense.value = false
  }
}
</script>

<style scoped>
@reference "tailwindcss";

/* Page Transition Animations 
  Smooth slide and fade effect when navigating between views
*/
.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
  will-change: opacity, transform;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>