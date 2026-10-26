<template>
  <div class="relative min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col overflow-hidden">

    <!-- Decorative background blobs -->
    <div class="absolute top-0 left-0 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
    <div class="absolute top-1/2 left-1/2 w-48 h-48 bg-purple-600/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

    <!-- Top bar with app name -->
    <div class="relative z-10 flex items-center justify-between px-6 pt-[calc(1rem+env(safe-area-inset-top))] pb-4">
      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Compass class="w-5 h-5 text-white" />
        </div>
        <span class="text-white font-extrabold text-lg tracking-tight">TureManager</span>
      </div>
      <!-- Theme toggle -->
      <button @click="toggleTheme"
        class="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-all active:scale-95">
        <Moon v-if="!isDark" class="w-4 h-4" />
        <Sun v-else class="w-4 h-4" />
      </button>
    </div>

    <!-- Hero Section -->
    <div class="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center py-8">

      <!-- Floating icon cluster -->
      <div class="relative mb-8">
        <div class="w-24 h-24 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/40 animate-float">
          <MapPin class="w-12 h-12 text-white" />
        </div>
        <!-- Small floating badges -->
        <div class="absolute -top-2 -right-3 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/40 animate-bounce-slow">
          <span class="text-white text-xs">৳</span>
        </div>
        <div class="absolute -bottom-2 -left-4 w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center shadow-lg shadow-amber-400/40 animate-pulse-slow">
          <Users class="w-3.5 h-3.5 text-white" />
        </div>
      </div>

      <h1 class="text-3xl font-extrabold text-white tracking-tight leading-tight">
        Your Tour,<br />
        <span class="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">One App.</span>
      </h1>

      <p class="text-sm text-white/50 mt-4 max-w-xs leading-relaxed">
        Track group expenses, manage budgets, and stay synced with your travel crew — all in one place.
      </p>

      <!-- Feature pills -->
      <div class="flex flex-wrap justify-center gap-2 mt-6">
        <span v-for="f in features" :key="f.label"
          class="flex items-center gap-1.5 px-3 py-1.5 bg-white/8 border border-white/10 rounded-full text-[11px] font-medium text-white/70">
          <component :is="f.icon" class="w-3 h-3" :class="f.color" />
          {{ f.label }}
        </span>
      </div>

    </div>

    <!-- Action Cards -->
    <div class="relative z-10 px-5 pb-12 flex flex-col gap-4 max-w-md mx-auto w-full">

      <!-- Create Tour -->
      <button @click="isCreateModalOpen = true"
        class="group relative w-full flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 active:scale-[0.98] transition-all overflow-hidden text-left">
        <!-- Shine effect -->
        <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
        <div class="relative w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
          <MapPinPlus class="w-6 h-6 text-white" />
        </div>
        <div class="relative flex-1">
          <p class="text-base font-bold text-white">Create a New Tour</p>
          <p class="text-xs text-white/70 mt-0.5">Start a journey as group admin</p>
        </div>
        <ChevronRight class="relative w-5 h-5 text-white/50 group-hover:translate-x-1 transition-transform" />
      </button>

      <!-- Join Tour -->
      <button @click="isJoinModalOpen = true"
        class="group relative w-full flex items-center gap-4 p-4 bg-white/8 border border-white/15 rounded-2xl hover:bg-white/12 hover:border-white/25 active:scale-[0.98] transition-all text-left backdrop-blur-sm">
        <div class="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
          <KeyRound class="w-6 h-6 text-indigo-300" />
        </div>
        <div class="flex-1">
          <p class="text-base font-bold text-white">Join Existing Tour</p>
          <p class="text-xs text-white/50 mt-0.5">Have an invite code? Enter here</p>
        </div>
        <ChevronRight class="w-5 h-5 text-white/30 group-hover:translate-x-1 transition-transform" />
      </button>

      <p class="text-center text-[10px] text-white/25 mt-2 uppercase tracking-widest">TureManager v1.0.0</p>
    </div>

    <!-- Pending Join Requests (User Side) -->
    <div v-if="joinRequestStore.myPendingRequests.length > 0" class="relative z-10 px-5 pb-8 max-w-md mx-auto w-full">
      <h3 class="text-xs font-bold text-white/50 uppercase tracking-wider mb-3 pl-2">My Join Requests</h3>
      <div class="flex flex-col gap-3">
        <div v-for="req in joinRequestStore.myPendingRequests" :key="req.id"
          class="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 shadow-lg flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 border border-amber-500/30">
              <Clock class="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <p class="text-sm font-bold text-white">{{ req.tourName }}</p>
              <p class="text-[10px] text-amber-200 mt-0.5">Approval Pending</p>
            </div>
          </div>
          <button @click="joinRequestStore.cancelRequest(req.id)"
            class="px-3 py-1.5 text-xs font-bold text-white bg-white/10 hover:bg-red-500/80 rounded-xl transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- ===== Create Tour Modal ===== -->
    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="isCreateModalOpen" class="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="isCreateModalOpen = false"></div>
          <div class="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden transition-colors">
            <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-800">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center">
                  <MapPinPlus class="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 class="text-base font-bold text-gray-800 dark:text-gray-100">Create New Tour</h3>
              </div>
              <button @click="isCreateModalOpen = false"
                class="p-1.5 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <X class="w-5 h-5" />
              </button>
            </div>
            <form @submit.prevent="handleCreateTour" class="p-5 flex flex-col gap-4">
              <div>
                <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Tour Name</label>
                <input v-model="createForm.name" type="text" required
                  placeholder="e.g. Cox's Bazar Trip 2025"
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 outline-none text-sm text-gray-800 dark:text-gray-100 transition-colors" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Initial Budget
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 font-bold text-xs">৳</span>
                    <input v-model.number="createForm.budget" type="number" placeholder="0"
                      class="w-full pl-7 pr-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 outline-none text-sm text-gray-800 dark:text-gray-100 transition-colors" />
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 text-blue-600 dark:text-blue-400">
                    Target/Person
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 font-bold text-xs">৳</span>
                    <input v-model.number="createForm.targetBudget" type="number" placeholder="0"
                      class="w-full pl-7 pr-3 py-2.5 bg-gray-50 dark:bg-slate-800 border-2 border-blue-100 dark:border-blue-900/30 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 outline-none text-sm text-gray-800 dark:text-gray-100 transition-colors" />
                  </div>
                </div>
              </div>
              <div class="flex gap-3 pt-2">
                <button type="button" @click="isCreateModalOpen = false"
                  class="flex-1 py-3 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 font-bold rounded-xl transition-colors active:scale-95">
                  Cancel
                </button>
                <button type="submit" :disabled="isCreating"
                  class="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2">
                  <svg v-if="isCreating" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{{ isCreating ? 'Creating...' : 'Create Tour' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ===== Join Tour Modal ===== -->
    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="isJoinModalOpen" class="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="isJoinModalOpen = false"></div>
          <div class="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden transition-colors">
            <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-800">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center">
                  <KeyRound class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 class="text-base font-bold text-gray-800 dark:text-gray-100">Join a Tour</h3>
              </div>
              <button @click="isJoinModalOpen = false"
                class="p-1.5 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <X class="w-5 h-5" />
              </button>
            </div>
            <form @submit.prevent="handleJoinTour" class="p-5 flex flex-col gap-4">
              <div>
                <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Invite Code</label>
                <input v-model="joinCode" type="text" required maxlength="6"
                  placeholder="XXXXXX"
                  class="w-full px-4 py-4 bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 outline-none text-center text-2xl font-extrabold tracking-[0.5em] uppercase text-gray-800 dark:text-gray-100 transition-colors" />
                <p class="text-xs text-gray-400 dark:text-gray-500 text-center mt-2">Ask the tour admin for the 6-digit code</p>
              </div>
              <div v-if="joinError" class="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl">
                <AlertCircle class="w-4 h-4 text-red-500 dark:text-red-400 shrink-0" />
                <p class="text-xs font-medium text-red-600 dark:text-red-400">{{ joinError }}</p>
              </div>
              <div class="flex gap-3 pt-2">
                <button type="button" @click="isJoinModalOpen = false"
                  class="flex-1 py-3 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 font-bold rounded-xl transition-colors active:scale-95">
                  Cancel
                </button>
                <button type="submit" :disabled="isJoining || joinCode.length < 6"
                  class="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 dark:shadow-blue-900/30 transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2">
                  <svg v-if="isJoining" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{{ isJoining ? 'Joining...' : 'Verify & Join' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Compass, MapPin, MapPinPlus, KeyRound, ChevronRight,
  Users, Receipt, BarChart3, Bell, X, AlertCircle, Moon, Sun,
  Clock, CheckCircle, XCircle, Loader2
} from 'lucide-vue-next'
import { useAuthStore } from '../stores/authStore'
import { useJoinRequestStore } from '../stores/joinRequestStore'
import { useTheme } from '../composables/useTheme'
import { firestore } from '../services/firebase'
import {
  collection, addDoc, doc, updateDoc,
  query, where, getDocs, arrayUnion
} from 'firebase/firestore'

const router = useRouter()
const authStore = useAuthStore()
const { isDark, toggleTheme } = useTheme()

const joinRequestStore = useJoinRequestStore()

onMounted(() => {
  if (authStore.userProfile.currentTourId) {
    router.push('/dashboard')
    return
  }
  // Start listening for user's own join requests
  if (authStore.user?.uid) {
    joinRequestStore.initUserListener(authStore.user.uid)
  }
})

const features = [
  { label: 'Expense Tracking', icon: Receipt, color: 'text-emerald-400' },
  { label: 'Group Polls', icon: BarChart3, color: 'text-indigo-400' },
  { label: 'Alerts', icon: Bell, color: 'text-amber-400' },
  { label: 'Member Budget', icon: Users, color: 'text-blue-400' },
]

// Modal states
const isCreateModalOpen = ref(false)
const isJoinModalOpen = ref(false)
const isCreating = ref(false)
const isJoining = ref(false)
const joinError = ref('')

// Form states
const createForm = reactive({ name: '', budget: null, targetBudget: null })
const joinCode = ref('')

// === Create Tour ===
const handleCreateTour = async () => {
  if (!createForm.name) return
  isCreating.value = true
  try {
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    const tourDocRef = await addDoc(collection(firestore, 'tours'), {
      name: createForm.name,
      budget: createForm.budget || 0,
      targetBudgetPerMember: createForm.targetBudget || 0,
      showContributionAmounts: true, // Default to true
      requireTransferApproval: true, // Default to true
      inviteCode,
      adminId: authStore.user.uid,
      members: [authStore.user.uid],
      contributions: { [authStore.user.uid]: createForm.budget || 0 },
      categories: [
        { id: 'food', label: 'Food', icon: 'Utensils', activeBg: 'bg-orange-100 dark:bg-orange-900/40', activeText: 'text-orange-600 dark:text-orange-400' },
        { id: 'transport', label: 'Transport', icon: 'Bus', activeBg: 'bg-blue-100 dark:bg-blue-900/40', activeText: 'text-blue-600 dark:text-blue-400' },
        { id: 'hotel', label: 'Hotel', icon: 'BedDouble', activeBg: 'bg-purple-100 dark:bg-purple-900/40', activeText: 'text-purple-600 dark:text-purple-400' },
        { id: 'activity', label: 'Activity', icon: 'Ticket', activeBg: 'bg-emerald-100 dark:bg-emerald-900/40', activeText: 'text-emerald-600 dark:text-emerald-400' },
        { id: 'shopping', label: 'Shopping', icon: 'ShoppingBag', activeBg: 'bg-pink-100 dark:bg-pink-900/40', activeText: 'text-pink-600 dark:text-pink-400' },
        { id: 'other', label: 'Other', icon: 'Receipt', activeBg: 'bg-gray-200 dark:bg-slate-800', activeText: 'text-gray-700 dark:text-gray-300' },
      ],
      createdAt: new Date().toISOString(),
    })
    await updateDoc(doc(firestore, 'users', authStore.user.uid), {
      currentTourId: tourDocRef.id, role: 'admin'
    })
    authStore.updateProfileData({ currentTourId: tourDocRef.id, role: 'admin' })
    isCreateModalOpen.value = false
    router.push('/dashboard')
  } catch (err) {
    console.error('Create tour error:', err)
  } finally {
    isCreating.value = false
  }
}

// === Join Tour ===
const handleJoinTour = async () => {
  if (!joinCode.value) return
  joinError.value = ''
  isJoining.value = true
  try {
    const q = query(
      collection(firestore, 'tours'),
      where('inviteCode', '==', joinCode.value.toUpperCase())
    )
    const snap = await getDocs(q)
    if (snap.empty) {
      joinError.value = 'Invalid invite code. Please check and try again.'
      isJoining.value = false
      return
    }
    const tourDoc = snap.docs[0]
    const tourData = tourDoc.data()
    const tourId = tourDoc.id

    // Check if requireJoinApproval is enabled
    if (tourData.requireJoinApproval) {
      // Send a join request instead of joining directly
      await joinRequestStore.sendRequest({
        tourId,
        tourName: tourData.name || 'Unknown Tour',
        userId: authStore.user.uid,
        userName: authStore.getUserName,
        userAvatar: authStore.getAvatar || '',
      })
      isJoinModalOpen.value = false
      joinCode.value = ''
    } else {
      // Direct join (old behavior)
      await updateDoc(doc(firestore, 'tours', tourId), {
        members: arrayUnion(authStore.user.uid),
        [`contributions.${authStore.user.uid}`]: 0
      })
      await updateDoc(doc(firestore, 'users', authStore.user.uid), {
        currentTourId: tourId, role: 'member'
      })
      authStore.updateProfileData({ currentTourId: tourId, role: 'member' })
      isJoinModalOpen.value = false
      router.push('/dashboard')
    }
  } catch (err) {
    if (err.message === 'already_pending') {
      joinError.value = 'You already have a pending request for this tour.'
    } else {
      console.error('Join tour error:', err)
      joinError.value = 'Something went wrong. Please try again.'
    }
  } finally {
    isJoining.value = false
  }
}
</script>

<style scoped>
@reference "tailwindcss";

/* Background glass shimmer */
.bg-white\/8 { background-color: rgb(255 255 255 / 0.08); }
.bg-white\/12 { background-color: rgb(255 255 255 / 0.12); }

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}
@keyframes bounceSlow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
@keyframes pulseSlow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.animate-float { animation: float 4s ease-in-out infinite; }
.animate-bounce-slow { animation: bounceSlow 3s ease-in-out infinite; }
.animate-pulse-slow { animation: pulseSlow 2.5s ease-in-out infinite; }

/* Bottom sheet modal transition */
.sheet-enter-active, .sheet-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.sheet-enter-from, .sheet-leave-to { opacity: 0; }
.sheet-enter-from .relative, .sheet-leave-to .relative {
  transform: translateY(40px);
  opacity: 0;
}

/* Hide number spinners */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
</style>