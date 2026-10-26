<template>
  <div class="settings-root w-full h-full">
    <div class="px-4 py-2 sm:px-6 animate-fade-in flex flex-col gap-6">

    <!-- Profile Card -->
    <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-gray-100 dark:border-slate-800 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] flex items-center gap-4 transition-colors">
      <div class="relative shrink-0">
        <img :src="authStore.getAvatar" alt="Profile"
          class="w-16 h-16 rounded-full object-cover border-2 border-gray-100 dark:border-slate-800 shadow-sm" />
      </div>
      <div class="flex-1 min-w-0">
        <h2 class="text-lg font-extrabold text-gray-800 dark:text-gray-100 truncate">{{ authStore.getUserName }}</h2>
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">{{ authStore.userProfile.email }}</p>
        <span class="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md"
          :class="authStore.userProfile.role === 'admin'
            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
            : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400'">
          {{ authStore.userProfile.role === 'admin' ? 'Tour Admin' : 'Member' }}
        </span>
      </div>
    </div>

    <!-- Tour Info -->
    <div v-if="tourStore.currentTour" class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
      <div class="p-4 border-b border-gray-100 dark:border-slate-800">
        <p class="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-wider">Active Tour</p>
        <p class="font-extrabold text-gray-800 dark:text-gray-100 text-base mt-0.5">{{ tourStore.tourName }}</p>
        <div class="flex items-center gap-2 mt-1">
          <span class="text-xs text-gray-500 dark:text-gray-400">Invite Code:</span>
          <button @click="copyCode" class="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-widest bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
            {{ tourStore.inviteCode }}
          </button>
          <span v-if="copied" class="text-[10px] text-green-500 dark:text-green-400 font-bold">Copied!</span>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-5">

      <!-- Tour Actions -->
      <div>
        <h3 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 pl-2">Tour Actions</h3>
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">

          <button v-if="isAdmin || tourStore.allowMemberDownload" @click="handleDownloadPDF" :disabled="pdfLoading"
            class="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors active:bg-gray-100 dark:active:bg-slate-800 group disabled:opacity-50">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileDown class="w-4 h-4" />
              </div>
              <div class="text-left">
                <span class="block text-sm font-bold text-gray-800 dark:text-gray-100">{{ pdfLoading ? 'Generating PDF...' : 'Download Tour Report' }}</span>
                <span class="block text-[10px] text-gray-500 dark:text-gray-400 font-medium">Get a full PDF summary of all expenses</span>
              </div>
            </div>
            <ChevronRight class="w-4 h-4 text-gray-300 dark:text-gray-600" />
          </button>

          <div v-if="isAdmin || tourStore.allowMemberDownload" class="h-px bg-gray-100 dark:bg-slate-800 ml-14"></div>

          <!-- Leave Tour (different flow for admin vs member) -->
          <button @click="handleLeaveTour" :disabled="leaveLoading"
            class="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors active:bg-gray-100 dark:active:bg-slate-800 group disabled:opacity-50">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <DoorOpen class="w-4 h-4" />
              </div>
              <div class="text-left">
                <span class="block text-sm font-bold text-gray-800 dark:text-gray-100">{{ leaveLoading ? 'Leaving...' : 'Leave Current Tour' }}</span>
                <span v-if="isAdmin" class="block text-[10px] text-orange-500 dark:text-orange-400 font-medium">You must transfer admin role first</span>
              </div>
            </div>
            <ChevronRight class="w-4 h-4 text-gray-300 dark:text-gray-600" />
          </button>
        </div>
      </div>

      <!-- Preferences -->
      <div>
        <h3 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 pl-2">Preferences</h3>
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
          <div class="w-full flex items-center justify-between p-4">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Bell class="w-4 h-4" />
              </div>
              <div>
                <span class="block text-sm font-bold text-gray-800 dark:text-gray-100">Push Notifications</span>
                <span class="block text-[10px] text-gray-400 dark:text-gray-500">
                  {{ notifPermission === 'denied' ? 'Blocked in browser' : (isEnabled && notifPermission === 'granted' ? 'Enabled' : 'Muted/Disabled') }}
                </span>
              </div>
            </div>
            <button @click="handleNotificationToggle"
              class="relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none"
              :class="isEnabled && notifPermission === 'granted' ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-200 dark:bg-slate-700'">
              <div class="absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm"
                :class="isEnabled && notifPermission === 'granted' ? 'translate-x-5' : 'translate-x-0'"></div>
            </button>
          </div>
        </div>
      </div>

      <!-- Admin Controls (Visible only to Admin) -->
      <div v-if="isAdmin">
        <h3 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 pl-2 flex items-center gap-1.5">
          <ShieldCheck class="w-3.5 h-3.5 text-indigo-500" />
          Admin Controls
        </h3>
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
          <div class="w-full flex items-center justify-between p-4">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <FileText class="w-4 h-4" />
              </div>
              <div>
                <span class="block text-sm font-bold text-gray-800 dark:text-gray-100">Member Report Download</span>
                <span class="block text-[10px] text-gray-400 dark:text-gray-500">
                  Allow members to download tour report
                </span>
              </div>
            </div>
            <button @click="toggleReportDownload"
              class="relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none"
              :class="tourStore.allowMemberDownload !== false ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-gray-200 dark:bg-slate-700'">
              <div class="absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm"
                :class="tourStore.allowMemberDownload !== false ? 'translate-x-5' : 'translate-x-0'"></div>
            </button>
          </div>

          <div class="h-px bg-gray-100 dark:bg-slate-800 mx-4"></div>

          <!-- Join Approval Toggle -->
          <div class="w-full flex items-center justify-between p-4">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <UserCheck class="w-4 h-4" />
              </div>
              <div>
                <span class="block text-sm font-bold text-gray-800 dark:text-gray-100">Require Join Approval</span>
                <span class="block text-[10px] text-gray-400 dark:text-gray-500">
                  New members need admin approval before joining
                </span>
              </div>
            </div>
            <button @click="toggleJoinApproval"
              class="relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none"
              :class="tourStore.currentTour?.requireJoinApproval ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-gray-200 dark:bg-slate-700'">
              <div class="absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm"
                :class="tourStore.currentTour?.requireJoinApproval ? 'translate-x-5' : 'translate-x-0'"></div>
            </button>
          </div>

          <div class="h-px bg-gray-100 dark:bg-slate-800 mx-4"></div>

          <!-- Allow Member Expense Request Toggle -->
          <div class="w-full flex items-center justify-between p-4">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Receipt class="w-4 h-4" />
              </div>
              <div>
                <span class="block text-sm font-bold text-gray-800 dark:text-gray-100">Member Expense Request</span>
                <span class="block text-[10px] text-gray-400 dark:text-gray-500">
                  Allow members to request group expenses
                </span>
              </div>
            </div>
            <button @click="toggleMemberExpenseRequest"
              class="relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none"
              :class="tourStore.allowMemberExpenseRequest !== false ? 'bg-amber-600 dark:bg-amber-500' : 'bg-gray-200 dark:bg-slate-700'">
              <div class="absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm"
                :class="tourStore.allowMemberExpenseRequest !== false ? 'translate-x-5' : 'translate-x-0'"></div>
            </button>
          </div>

          <div class="h-px bg-gray-100 dark:bg-slate-800 mx-4"></div>

          <!-- Transfer Approval Toggle -->
          <div class="w-full flex items-center justify-between p-4 border-b border-gray-50 dark:border-slate-800/50">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Receipt class="w-4 h-4" />
              </div>
              <div>
                <span class="block text-sm font-bold text-gray-800 dark:text-gray-100">Show Individual Payments</span>
                <span class="block text-[10px] text-gray-400 dark:text-gray-500">
                  Members can see each other's payment amounts
                </span>
              </div>
            </div>
            <button @click="toggleContributionVisibility"
              class="relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none"
              :class="tourStore.showContributionAmounts ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-200 dark:bg-slate-700'">
              <div class="absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm"
                :class="tourStore.showContributionAmounts ? 'translate-x-5' : 'translate-x-0'"></div>
            </button>
          </div>

          <div class="w-full flex items-center justify-between p-4">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <ArrowLeftRight class="w-4 h-4" />
              </div>
              <div>
                <span class="block text-sm font-bold text-gray-800 dark:text-gray-100">Require Transfer Approval</span>
                <span class="block text-[10px] text-gray-400 dark:text-gray-500">
                  Member transfers need admin approval
                </span>
              </div>
            </div>
            <button @click="toggleTransferApproval"
              class="relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none"
              :class="tourStore.requireTransferApproval ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-200 dark:bg-slate-700'">
              <div class="absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm"
                :class="tourStore.requireTransferApproval ? 'translate-x-5' : 'translate-x-0'"></div>
            </button>
          </div>
        </div>
      </div>


    </div>
  </div>

    <!-- Logout -->
    <div class="mt-4 mb-6">
      <button @click="handleLogout"
        class="w-full py-3.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 font-bold rounded-2xl transition-colors active:scale-95 flex items-center justify-center gap-2 border border-red-100 dark:border-red-900/50">
        <LogOut class="w-4 h-4" />
        Log Out
      </button>
      <p class="text-center text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-4 uppercase tracking-widest">Tour Manager v1.0.0</p>
    </div>

    <!-- ===== Admin Transfer Modal ===== -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showTransferModal" class="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showTransferModal = false"></div>
          <div class="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-colors">
            <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-800 shrink-0">
              <div>
                <h3 class="text-base font-bold text-gray-800 dark:text-gray-100">Transfer Admin Role</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Select a member to become the new admin</p>
              </div>
              <button @click="showTransferModal = false"
                class="p-1.5 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <X class="w-5 h-5" />
              </button>
            </div>

            <div class="p-4 overflow-y-auto flex flex-col gap-2">
              <div v-if="otherMembers.length === 0"
                class="p-6 text-center text-gray-400 dark:text-gray-500 text-sm">
                No other members to transfer admin role to.
              </div>
              <button v-for="m in otherMembers" :key="m.uid" @click="selectedNewAdmin = m"
                class="flex items-center gap-3 p-3.5 rounded-2xl border transition-all text-left"
                :class="selectedNewAdmin?.uid === m.uid
                  ? 'border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/30'
                  : 'border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800'">
                <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold uppercase shrink-0 overflow-hidden">
                  <img v-if="m.avatar" :src="m.avatar" class="w-full h-full object-cover" />
                  <span v-else>{{ m.name?.charAt(0) || 'U' }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">{{ m.name }}</p>
                  <p class="text-[10px] text-gray-500 dark:text-gray-400 truncate">{{ m.email || '' }}</p>
                </div>
                <div v-if="selectedNewAdmin?.uid === m.uid"
                  class="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                  <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                </div>
              </button>
            </div>

            <div class="px-5 py-4 border-t border-gray-100 dark:border-slate-800 flex flex-col gap-3 shrink-0">
              <div class="flex gap-2">
                <button @click="confirmTransfer(false)" :disabled="!selectedNewAdmin || transferLoading"
                  class="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-blue-200 dark:shadow-blue-900/30 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5">
                  <svg v-if="transferLoading && !isLeaving" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span v-else>Transfer Only</span>
                </button>
                <button @click="confirmTransfer(true)" :disabled="!selectedNewAdmin || transferLoading"
                  class="flex-1 py-3 bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-orange-200 dark:shadow-orange-900/30 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5">
                  <svg v-if="transferLoading && isLeaving" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span v-else>Transfer & Leave</span>
                </button>
              </div>
              <button @click="showTransferModal = false"
                class="w-full py-3 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 font-bold rounded-xl transition-colors active:scale-95">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useTourStore } from '../stores/tourStore'
import { useExpenseStore } from '../stores/expenseStore'
import { useContributionStore } from '../stores/contributionStore'
import { useTransferStore } from '../stores/transferStore'
import { useToastStore } from '../stores/toastStore'
import { auth, firestore } from '../services/firebase'
import { signOut } from 'firebase/auth'
import { doc, updateDoc, arrayRemove } from 'firebase/firestore'
import { FileDown, DoorOpen, Bell, ChevronRight, LogOut, X, ShieldCheck, FileText, UserCheck, Receipt, ArrowLeftRight } from 'lucide-vue-next'
import { useNotification } from '../composables/useNotification'

const router = useRouter()
const authStore = useAuthStore()
const tourStore = useTourStore()
const expenseStore = useExpenseStore()
const contributionStore = useContributionStore()
const transferStore = useTransferStore()
const toastStore = useToastStore()
const { notifPermission, isEnabled, requestPermission, toggleNotifications } = useNotification()

const pdfLoading = ref(false)
const leaveLoading = ref(false)
const copied = ref(false)
const showTransferModal = ref(false)
const selectedNewAdmin = ref(null)
const transferLoading = ref(false)

const isAdmin = computed(() => tourStore.currentTour?.adminId === authStore.user?.uid)

const toggleJoinApproval = async () => {
  if (!isAdmin.value || !tourStore.tourId) return
  try {
    const newVal = !tourStore.currentTour?.requireJoinApproval
    await updateDoc(doc(firestore, 'tours', tourStore.tourId), {
      requireJoinApproval: newVal
    })
    toastStore.addToast(`Join approval ${newVal ? 'enabled' : 'disabled'}.`, 'info')
  } catch (err) {
    console.error('toggleJoinApproval error:', err)
    toastStore.addToast('Failed to update setting.', 'error')
  }
}

const toggleReportDownload = async () => {
  if (!isAdmin.value || !tourStore.tourId) return
  
  // Get current value from store getter
  const currentStatus = tourStore.allowMemberDownload
  const newStatus = !currentStatus
  
  try {
    await updateDoc(doc(firestore, 'tours', tourStore.tourId), {
      allowMemberDownload: newStatus
    })
    toastStore.addToast(`Member downloads ${newStatus ? 'enabled' : 'disabled'}`, 'info')
  } catch (err) {
    console.error('Update setting error:', err)
    toastStore.addToast('Failed to update setting', 'error')
  }
}

const toggleMemberExpenseRequest = async () => {
  if (!isAdmin.value) return
  const newState = tourStore.allowMemberExpenseRequest === false
  try {
    await updateDoc(doc(firestore, 'tours', tourStore.tourId), {
      allowMemberExpenseRequest: newState
    })
    toastStore.addToast(`Member expense requests ${newState ? 'enabled' : 'disabled'}`, 'info')
  } catch (err) {
    toastStore.addToast('Failed to update setting', 'error')
  }
}

// Members excluding current user (for admin transfer)
const otherMembers = computed(() =>
  tourStore.members.filter(m => m.uid !== authStore.user?.uid)
)

// === Notification Permission ===

const handleNotificationToggle = async () => {
  if (typeof Notification === 'undefined') {
    toastStore.addToast('Your browser does not support notifications.', 'warning')
    return
  }

  // If already denied in browser, we can't do much
  if (notifPermission.value === 'denied') {
    toastStore.addToast('Notifications are blocked in browser settings. Please allow them first.', 'warning')
    return
  }

  // If not granted yet, request it
  if (notifPermission.value !== 'granted') {
    const granted = await requestPermission()
    if (!granted) {
      toastStore.addToast('Notification permission denied.', 'warning')
      return
    }
  }

  // Toggle local state
  const newState = toggleNotifications()
  toastStore.addToast(`Notifications ${newState ? 'enabled' : 'muted'}.`, 'info')
}

// Toggle Transfer Approval
const toggleTransferApproval = async () => {
  if (!tourStore.tourId) return
  try {
    const newValue = !tourStore.requireTransferApproval
    await updateDoc(doc(firestore, "tours", tourStore.tourId), {
      requireTransferApproval: newValue
    })
    tourStore.updateTourDetails({ requireTransferApproval: newValue })
    toastStore.addToast(`Transfer approval ${newValue ? 'enabled' : 'disabled'}`, 'success')
  } catch (e) {
    console.error("Toggle Transfer Approval Error:", e)
    toastStore.addToast("Failed to update setting", 'error')
  }
}

// Toggle Contribution Visibility
const toggleContributionVisibility = async () => {
  if (!tourStore.tourId) return
  try {
    const newValue = !tourStore.showContributionAmounts
    await updateDoc(doc(firestore, "tours", tourStore.tourId), {
      showContributionAmounts: newValue
    })
    tourStore.updateTourDetails({ showContributionAmounts: newValue })
    toastStore.addToast(`Contribution visibility ${newValue ? 'enabled' : 'hidden'}`, 'success')
  } catch (e) {
    console.error("Toggle Contribution Visibility Error:", e)
    toastStore.addToast("Failed to update setting", 'error')
  }
}

// === Copy Invite Code ===
const copyCode = async () => {
  if (!tourStore.inviteCode) return
  try {
    await navigator.clipboard.writeText(tourStore.inviteCode)
    copied.value = true
    toastStore.addToast('Invite code copied!', 'success')
    setTimeout(() => copied.value = false, 2000)
  } catch (e) {
    toastStore.addToast(`Invite Code: ${tourStore.inviteCode}`, 'info')
  }
}

// === Leave Tour ===
const handleLeaveTour = () => {
  if (isAdmin.value) {
    // Admin must transfer role first
    selectedNewAdmin.value = null
    showTransferModal.value = true
  } else {
    doLeaveTour()
  }
}

const doLeaveTour = async () => {
  if (!confirm('Are you sure you want to leave this tour?')) return
  leaveLoading.value = true
  try {
    await updateDoc(doc(firestore, 'tours', tourStore.tourId), {
      members: arrayRemove(authStore.user.uid)
    })
    await updateDoc(doc(firestore, 'users', authStore.user.uid), {
      currentTourId: null, role: 'member'
    })
    authStore.updateProfileData({ currentTourId: null, role: 'member' })
    tourStore.clearTour()
    toastStore.addToast('You have left the tour.', 'success')
    router.push('/welcome')
  } catch (err) {
    console.error('Leave tour error:', err)
    toastStore.addToast('Could not leave tour. Please try again.', 'error')
  } finally {
    leaveLoading.value = false
  }
}

const isLeaving = ref(false)

const confirmTransfer = async (leaveTour) => {
  if (!selectedNewAdmin.value) return
  transferLoading.value = true
  isLeaving.value = leaveTour
  const newAdmin = selectedNewAdmin.value
  try {
    const tourRef = doc(firestore, 'tours', tourStore.tourId)
    // Update tour adminId
    await updateDoc(tourRef, { adminId: newAdmin.uid })
    // Update new admin's user role
    await updateDoc(doc(firestore, 'users', newAdmin.uid), { role: 'admin' })
    
    if (leaveTour) {
      // Remove current admin from tour
      await updateDoc(tourRef, { members: arrayRemove(authStore.user.uid) })
      // Update current user's profile
      await updateDoc(doc(firestore, 'users', authStore.user.uid), {
        currentTourId: null, role: 'member'
      })
      authStore.updateProfileData({ currentTourId: null, role: 'member' })
      tourStore.clearTour()
      showTransferModal.value = false
      toastStore.addToast(`${newAdmin.name} is now the admin. You have left the tour.`, 'success', 4000)
      router.push('/welcome')
    } else {
      // Just become a regular member
      await updateDoc(doc(firestore, 'users', authStore.user.uid), { role: 'member' })
      authStore.updateProfileData({ role: 'member' })
      showTransferModal.value = false
      toastStore.addToast(`${newAdmin.name} is now the admin.`, 'success')
      // Page will automatically reflect the change because authStore role changed
      // Re-init listener is not needed, watcher in AppLayout takes care of it or dashboard re-renders
      router.push('/dashboard')
    }
  } catch (err) {
    console.error('Transfer admin error:', err)
    toastStore.addToast('Failed to transfer admin role. Please try again.', 'error')
  } finally {
    transferLoading.value = false
    isLeaving.value = false
  }
}

// === PDF Download ===
const handleDownloadPDF = async () => {
  pdfLoading.value = true
  try {
    const { jsPDF } = await import('jspdf')
    const { default: autoTable } = await import('jspdf-autotable')
    const pdfDoc = new jsPDF()
    const tourName = tourStore.tourName
    const now = new Date().toLocaleDateString('en-BD')
    
    // Header
    pdfDoc.setFontSize(20); pdfDoc.setTextColor(37, 99, 235)
    pdfDoc.text('Tour Manager - Expense Report', 14, 22)
    pdfDoc.setFontSize(11); pdfDoc.setTextColor(100, 100, 100)
    pdfDoc.text(`Tour: ${tourName}`, 14, 32)
    pdfDoc.text(`Generated: ${now}`, 14, 38)

    // Helper for member contribution calculation
    const getMemberContribution = (uid) => {
      const cash = contributionStore.contributionsByMember[uid] || 0
      const isAdmin = tourStore.currentTour?.adminId === uid
      const spent = expenseStore.getMemberPaidAmount(uid)
      const netTx = transferStore.netTransfer(uid)
      return (isAdmin ? cash : (cash + spent)) + netTx
    }

    const totalContribSum = tourStore.members.reduce((sum, m) => sum + getMemberContribution(m.uid), 0)
    const totalSpent = expenseStore.totalGroupSpent
    const membersCount = tourStore.activeMembers.length || 1

    // 1. Summary Table
    pdfDoc.setFontSize(13); pdfDoc.setTextColor(0, 0, 0)
    pdfDoc.text('Tour Summary', 14, 52)
    autoTable(pdfDoc, {
      startY: 56,
      head: [['Metric', 'Amount']],
      body: [
        ['Total Contribution (Cash + Pocket)', `BDT ${Number(totalContribSum).toLocaleString('en-IN')}`],
        ['Total Group Spent', `BDT ${Number(totalSpent).toLocaleString('en-IN')}`],
        ['Group Balance (Net)', `BDT ${Number(totalContribSum - totalSpent).toLocaleString('en-IN')}`],
        ['Total Members', membersCount],
        ['Average Cost per Member', `BDT ${Number(totalSpent / membersCount).toLocaleString('en-IN')}`],
      ],
      theme: 'grid', headStyles: { fillColor: [37, 99, 235] },
    })

    // 2. Member Wise Summary Table
    pdfDoc.text('Member Summary', 14, pdfDoc.lastAutoTable.finalY + 16)
    
    const memberRows = tourStore.members.map(m => {
      const contrib = getMemberContribution(m.uid)
      const share = expenseStore.getMemberShare(m.uid, tourStore.activeMembers)
      const bal = contrib - share
      const spent = expenseStore.getMemberPaidAmount(m.uid)
      const netTx = transferStore.netTransfer(m.uid)
      return [
        m.name + (tourStore.isMemberPaused(m.uid) ? ' (Paused)' : ''),
        `BDT ${Number(contributionStore.contributionsByMember[m.uid] || 0).toLocaleString('en-IN')}`,
        `BDT ${Number(spent).toLocaleString('en-IN')}`,
        `BDT ${Number(netTx).toLocaleString('en-IN')}`,
        `BDT ${Number(contrib).toLocaleString('en-IN')}`,
        `BDT ${Number(share).toLocaleString('en-IN')}`,
        { content: `BDT ${Number(bal).toLocaleString('en-IN')}`, styles: { textColor: bal >= 0 ? [22, 163, 74] : [220, 38, 38] } }
      ]
    })
    autoTable(pdfDoc, {
      startY: pdfDoc.lastAutoTable.finalY + 22,
      head: [['Member', 'Cash Given', 'Pocket Spent', 'Net Transfer', 'Total Contrib', 'Share', 'Net Balance']],
      body: memberRows,
      theme: 'grid', headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 8 }
    })

    // 3. All Expenses Table
    pdfDoc.text('Detailed Expenses', 14, pdfDoc.lastAutoTable.finalY + 16)
    const expenseRows = expenseStore.groupExpenses.map(exp => [
      exp.title, exp.category, exp.paidByName || 'N/A',
      `BDT ${Number(exp.amount).toLocaleString('en-IN')}`,
      exp.note || '-',
      exp.date ? new Date(exp.date).toLocaleDateString('en-BD') : '-'
    ])
    autoTable(pdfDoc, {
      startY: pdfDoc.lastAutoTable.finalY + 22,
      head: [['Title', 'Category', 'Paid By', 'Amount', 'Note', 'Date']],
      body: expenseRows.length > 0 ? expenseRows : [['No expenses recorded', '', '', '', '', '']],
      theme: 'striped', headStyles: { fillColor: [37, 99, 235] },
    })

    pdfDoc.save(`${tourName.replace(/\s+/g, '_')}_Report_${now}.pdf`)
  } catch (error) {
    console.error('PDF error:', error)
    toastStore.addToast('Failed to generate PDF. Please try again.', 'error')
  } finally {
    pdfLoading.value = false
  }
}

// === Logout ===
const handleLogout = async () => {
  try {
    await signOut(auth)
    router.push('/login')
  } catch (err) {
    console.error('Logout error:', err)
  }
}
</script>

<style scoped>
@reference "tailwindcss";

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-enter-active, .modal-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .relative, .modal-leave-to .relative { transform: translateY(30px); opacity: 0; }
</style>