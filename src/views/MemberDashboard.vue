<template>
  <div class="px-4 py-2 sm:px-6 animate-fade-in flex flex-col gap-5 pb-4">
    
    <!-- ===== SKELETON LOADER ===== -->
    <div v-if="isLoadingData" class="flex flex-col gap-4">
      <div class="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-5 shadow-xl h-44 flex flex-col justify-between">
        <SkeletonLoader widthClass="w-32" heightClass="h-4" class="bg-white/20" />
        <div class="flex gap-4 mt-3">
          <SkeletonLoader widthClass="w-full" heightClass="h-12" class="bg-white/10" />
          <SkeletonLoader widthClass="w-full" heightClass="h-12" class="bg-white/10" />
        </div>
        <SkeletonLoader widthClass="w-full" heightClass="h-12" class="bg-white/10 mt-2" />
      </div>
      <div class="grid grid-cols-2 gap-3">
        <SkeletonLoader widthClass="w-full" heightClass="h-20" class="rounded-2xl" />
        <SkeletonLoader widthClass="w-full" heightClass="h-20" class="rounded-2xl" />
      </div>
      <SkeletonLoader widthClass="w-full" heightClass="h-32" class="rounded-2xl" />
    </div>

    <template v-else>
      <!-- Member Balance Card -->
    <div class="relative bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-5 text-white shadow-xl overflow-hidden">
      <div class="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>

      <div class="relative z-10">
        <span class="text-blue-100 text-xs font-semibold uppercase tracking-wider">{{ tourStore.tourName }}</span>
        
        <!-- My contribution vs Group Available Balance -->
        <div class="flex gap-4 mt-3">
          <div class="flex-1">
            <span class="text-blue-100 text-[10px] uppercase font-bold block mb-0.5">My Total Contribution</span>
            <span class="text-2xl font-extrabold">৳ {{ fmt(myTotalContribution) }}</span>
          </div>
          <div class="w-px bg-white/20"></div>
          <div class="flex-1 pl-2">
            <span class="text-blue-100 text-[10px] uppercase font-bold block mb-0.5">Group Balance</span>
            <span class="text-2xl font-extrabold">৳ {{ fmt(groupBalance) }}</span>
          </div>
        </div>

        <!-- Balance indicator -->
        <div class="mt-4 pt-4 border-t border-white/20 flex justify-between items-center">
          <div>
            <span class="text-blue-100 text-[10px] uppercase font-bold">My Net Balance</span>
            <div class="text-xl font-extrabold" :class="myBalance >= 0 ? 'text-green-300' : 'text-red-300'">
              {{ myBalance >= 0 ? '+ ' : '- ' }}৳ {{ fmt(Math.abs(myBalance)) }}
            </div>
            <span class="text-[10px] text-blue-200">{{ myBalance >= 0 ? 'Group owes you' : 'You owe the group' }}</span>
          </div>
          <div class="text-right">
            <span class="text-blue-100 text-[10px] uppercase font-bold block">My Share</span>
            <span class="text-lg font-bold">৳ {{ fmt(myShare) }}</span>
          </div>
        </div>

        <!-- Target Budget Status -->
        <div v-if="tourStore.targetBudgetPerMember > 0" class="mt-4 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
          <div class="flex justify-between items-center mb-1">
            <span class="text-blue-100 text-[10px] uppercase font-bold">Target Contribution</span>
            <span class="text-xs font-extrabold">৳ {{ fmt(tourStore.targetBudgetPerMember) }}</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div class="h-full bg-green-400 rounded-full transition-all duration-1000"
                :style="{ width: Math.min((myTotalContribution / tourStore.targetBudgetPerMember) * 100, 100) + '%' }"></div>
            </div>
            <span class="text-[10px] font-bold">
              {{ Math.round((myTotalContribution / tourStore.targetBudgetPerMember) * 100) }}%
            </span>
          </div>
          <p class="text-[10px] mt-1.5 font-medium" :class="myTotalContribution >= tourStore.targetBudgetPerMember ? 'text-green-300' : 'text-orange-200'">
            {{ myTotalContribution >= tourStore.targetBudgetPerMember ? '✓ Target budget fulfilled!' : `⚠️ Need ৳${fmt(tourStore.targetBudgetPerMember - myTotalContribution)} more to reach target.` }}
          </p>
        </div>

        <!-- Invite Code -->
        <div class="mt-4 flex items-center gap-2">
          <span class="text-blue-100 text-[10px] font-semibold uppercase">Code:</span>
          <button @click="copyCode" class="flex items-center gap-1 px-2 py-0.5 bg-white/20 rounded-md text-xs font-bold tracking-widest hover:bg-white/30 transition-colors">
            {{ tourStore.inviteCode }}
            <Copy class="w-3 h-3" />
          </button>
          <span v-if="codeCopied" class="text-[10px] text-green-300 font-semibold">Copied!</span>
        </div>
      </div>
    </div>

    <!-- Paused Banner -->
    <div v-if="tourStore.isMemberPaused(authStore.user.uid)" class="p-3.5 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center gap-3 mb-2">
      <div class="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center shrink-0">
        <AlertCircle class="w-4 h-4 text-amber-600 dark:text-amber-400" />
      </div>
      <div>
        <p class="text-xs font-bold text-amber-800 dark:text-amber-400">Account Paused</p>
        <p class="text-[10px] text-amber-700 dark:text-amber-500">You are in read-only mode and cannot perform group actions.</p>
      </div>
    </div>

    <!-- My Pending Fund Requests -->
    <div v-if="myPendingFundRequests.length > 0" class="p-3.5 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-2xl transition-colors">
      <p class="text-xs font-bold text-amber-800 dark:text-amber-400 mb-2 flex items-center gap-1.5">
        <Clock class="w-3.5 h-3.5" /> {{ myPendingFundRequests.length }} fund request(s) pending admin approval
      </p>
      <div v-for="req in myPendingFundRequests" :key="req.id" class="flex justify-between text-xs text-amber-700 dark:text-amber-300 py-1 border-t border-amber-100 dark:border-amber-800/50">
        <span>৳ {{ fmt(req.amount) }} <span class="text-amber-500 dark:text-amber-500/80 italic">"{{ req.note || 'No note' }}"</span></span>
        <span class="font-bold">Pending</span>
      </div>
    </div>

    <!-- My Pending Expense Requests -->
    <div v-if="myPendingExpenseRequests.length > 0" class="p-3.5 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-2xl transition-colors">
      <p class="text-xs font-bold text-blue-800 dark:text-blue-400 mb-2 flex items-center gap-1.5">
        <Clock class="w-3.5 h-3.5" /> {{ myPendingExpenseRequests.length }} expense(s) pending admin approval
      </p>
      <div v-for="req in myPendingExpenseRequests" :key="req.id" class="flex justify-between text-xs text-blue-700 dark:text-blue-300 py-1 border-t border-blue-100 dark:border-blue-800/50">
        <span class="font-bold truncate max-w-[60%]">{{ req.title }}</span>
        <span>৳ {{ fmt(req.amount) }} <span class="text-blue-400 dark:text-blue-500/80 italic">· {{ req.category }}</span></span>
      </div>
    </div>

    <!-- Quick Actions for Member -->
    <div class="grid grid-cols-2 gap-3">
      <button @click="isAddFundOpen = true" :disabled="tourStore.isMemberPaused(authStore.user.uid)"
        class="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-100 dark:hover:border-slate-700 transition-all active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed">
        <div class="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 transition-colors">
          <Plus class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div class="text-left">
          <span class="text-xs font-bold text-gray-800 dark:text-gray-100 block transition-colors">Add Fund</span>
          <span class="text-[10px] text-gray-500 dark:text-gray-400 transition-colors">Send request</span>
        </div>
      </button>

      <button @click="isTransferOpen = true" :disabled="tourStore.isMemberPaused(authStore.user.uid)"
        class="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-100 dark:hover:border-slate-700 transition-all active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed">
        <div class="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
          <ArrowLeftRight class="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div class="text-left">
          <span class="text-xs font-bold text-gray-800 dark:text-gray-100 block transition-colors">Transfer</span>
          <span class="text-[10px] text-gray-500 dark:text-gray-400 transition-colors">Send to member</span>
        </div>
      </button>

      <button @click="isMembersOpen = true"
        class="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-100 dark:hover:border-slate-700 transition-all active:scale-95 group">
        <div class="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50 transition-colors">
          <Users class="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div class="text-left">
          <span class="text-xs font-bold text-gray-800 dark:text-gray-100 block transition-colors">Members</span>
          <span class="text-[10px] text-gray-500 dark:text-gray-400 transition-colors">{{ tourStore.members.length }} in group</span>
        </div>
      </button>
    </div>

    <!-- My Contribution History -->
    <div>
      <h3 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">My Contribution History</h3>
      
      <!-- Contribution Skeleton -->
      <div v-if="contributionStore.isLoading" class="flex flex-col gap-2">
        <div v-for="i in 2" :key="i" class="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm">
          <SkeletonLoader widthClass="w-9" heightClass="h-9" circle />
          <div class="flex-1 space-y-2">
            <SkeletonLoader widthClass="w-16" heightClass="h-4" />
            <SkeletonLoader widthClass="w-32" heightClass="h-2" />
          </div>
          <SkeletonLoader widthClass="w-12" heightClass="h-4" class="rounded-full" />
        </div>
      </div>

      <div v-else-if="myContributions.length > 0" class="flex flex-col gap-2">
        <div v-for="c in myContributions" :key="c.id" class="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl transition-colors">
          <div class="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
            <ArrowUpCircle class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-gray-800 dark:text-gray-100">৳ {{ fmt(c.amount) }}</p>
            <p class="text-[10px] text-gray-500 dark:text-gray-400 truncate">{{ c.note || 'No note' }} · {{ fmtDate(c.date) }}</p>
          </div>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 transition-colors">Added</span>
        </div>
      </div>
      <div v-else class="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-slate-900 border border-dashed border-gray-200 dark:border-slate-800 rounded-2xl transition-colors">
        <Wallet class="w-7 h-7 text-gray-300 dark:text-slate-600 mb-2" />
        <p class="text-xs text-gray-500 dark:text-gray-400">No contributions yet. Tap Add Fund!</p>
      </div>
    </div>

    <!-- My Recent Expenses in Group -->
    <div>
      <h3 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">My Group Expenses</h3>
      
      <!-- Expense Skeleton -->
      <div v-if="expenseStore.isLoading" class="flex flex-col gap-3">
        <div v-for="i in 2" :key="i" class="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex justify-between items-center">
          <div class="space-y-2 flex-1">
            <SkeletonLoader widthClass="w-3/4" heightClass="h-4" />
            <SkeletonLoader widthClass="w-1/2" heightClass="h-2" />
          </div>
          <SkeletonLoader widthClass="w-16" heightClass="h-5" />
        </div>
      </div>

      <div v-else-if="myExpenses.length > 0" class="flex flex-col">
        <ExpenseItem v-for="e in myExpenses" :key="e.id" :expense="e" @view-details="selectedExpense = e" />
      </div>
      <div v-else class="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-slate-900 border border-dashed border-gray-200 dark:border-slate-800 rounded-2xl transition-colors">
        <Receipt class="w-7 h-7 text-gray-300 dark:text-slate-600 mb-2" />
        <p class="text-xs text-gray-500 dark:text-gray-400">You haven't logged any group expenses.</p>
      </div>
    </div>

    <!-- ===== MODALS ===== -->

    <!-- Add Fund (Member sends request) -->
    <ActionModal :isOpen="isAddFundOpen" title="Request Fund" @close="isAddFundOpen = false">
      <form @submit.prevent="sendFundRequest" class="flex flex-col gap-4">
        <div>
          <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Amount (৳)</label>
          <input v-model.number="fundAmount" type="number" required min="1" placeholder="0.00"
            class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 dark:focus:border-blue-500 outline-none text-lg font-bold text-gray-900 dark:text-gray-100 transition-colors">
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Note (Optional)</label>
          <input v-model="fundNote" type="text" placeholder="e.g. My initial contribution"
            class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 dark:focus:border-blue-500 outline-none text-sm text-gray-900 dark:text-gray-100 transition-colors">
        </div>
        <div class="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-xs text-blue-700 dark:text-blue-400 transition-colors">
          📤 Your request will be sent to the Admin for approval.
        </div>
        <button type="submit" :disabled="fundLoading"
          class="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold rounded-xl disabled:opacity-60 shadow-lg shadow-orange-200 dark:shadow-orange-900/20 transition-all flex justify-center items-center gap-2">
          <svg v-if="fundLoading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <span v-else>Send Request to Admin</span>
        </button>
      </form>
    </ActionModal>

    <!-- Members Modal -->
    <ActionModal :isOpen="isMembersOpen" title="Group Members" @close="isMembersOpen = false">
      <div class="flex flex-col gap-3 max-h-[60vh] overflow-y-auto">
        <!-- Members Skeleton -->
        <div v-if="tourStore.isMembersLoading" class="flex flex-col gap-3">
          <div v-for="i in 3" :key="i" class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-800">
            <SkeletonLoader widthClass="w-10" heightClass="h-10" circle />
            <div class="flex-1 space-y-2">
              <SkeletonLoader widthClass="w-1/2" heightClass="h-4" />
              <SkeletonLoader widthClass="w-1/3" heightClass="h-2" />
            </div>
            <SkeletonLoader widthClass="w-12" heightClass="h-4" class="rounded-full" />
          </div>
        </div>

        <template v-else>
          <div v-for="m in tourStore.members" :key="m.uid" class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-800 transition-colors">
            <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold uppercase overflow-hidden shrink-0">
            <img v-if="m.avatar" :src="m.avatar" class="w-full h-full object-cover">
            <span v-else>{{ m.name?.charAt(0) || 'U' }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">{{ m.name }}</p>
            <p class="text-[10px] text-gray-500 dark:text-gray-400">
              Contributed: 
              <span v-if="tourStore.isAdmin(authStore.user.uid) || tourStore.showContributionAmounts" class="font-bold">৳ {{ fmt(contributionStore.contributionsByMember[m.uid] || 0) }}</span>
              <span v-else class="italic opacity-60">Hidden</span>
            </p>
          </div>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize transition-colors"
            :class="m.role === 'admin' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400'">{{ m.role }}</span>
        </div>
        </template>
      </div>
    </ActionModal>

    <!-- Expense Details -->
    <ActionModal :isOpen="!!selectedExpense" :title="selectedExpense?.title || 'Details'" @close="selectedExpense = null">
      <div v-if="selectedExpense" class="flex flex-col gap-3">
        <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl transition-colors">
          <span class="text-sm text-gray-600 dark:text-gray-400">Amount</span>
          <span class="text-lg font-extrabold text-gray-900 dark:text-gray-100">৳ {{ fmt(selectedExpense.amount) }}</span>
        </div>
        <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl transition-colors">
          <span class="text-sm text-gray-600 dark:text-gray-400">Category</span>
          <span class="font-bold capitalize text-sm text-gray-900 dark:text-gray-100">{{ selectedExpense.category }}</span>
        </div>
        <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl transition-colors">
          <span class="text-sm text-gray-600 dark:text-gray-400">Date</span>
          <span class="font-bold text-sm text-gray-900 dark:text-gray-100">{{ fmtDate(selectedExpense.date || selectedExpense.createdAt) }}</span>
        </div>
        <div v-if="selectedExpense.note" class="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl transition-colors">
          <span class="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase block mb-1">Note</span>
          <span class="text-sm text-gray-900 dark:text-gray-100">{{ selectedExpense.note }}</span>
        </div>
      </div>
    </ActionModal>

    <!-- Transfer Modal -->
    <TransferModal
      :isOpen="isTransferOpen"
      :fromMember="{ uid: uid, name: authStore.getUserName, avatar: authStore.userProfile.avatar }"
      :senderBalance="myBalance"
      @close="isTransferOpen = false"
      @done="isTransferOpen = false"
    />

    </template>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Copy, Plus, Users, Wallet, Receipt, Clock, ArrowLeftRight, AlertCircle } from 'lucide-vue-next'
import { useTourStore } from '../stores/tourStore'
import { useExpenseStore } from '../stores/expenseStore'
import { useAuthStore } from '../stores/authStore'
import { useFundRequestStore } from '../stores/fundRequestStore'
import { useContributionStore } from '../stores/contributionStore'
import { useExpenseRequestStore } from '../stores/expenseRequestStore'
import { useTransferStore } from '../stores/transferStore'
import { useToastStore } from '../stores/toastStore'
import { firestore } from '../services/firebase'
import { addDoc, collection } from 'firebase/firestore'

import ExpenseItem from '../components/expenses/ExpenseItem.vue'
import ActionModal from '../components/common/ActionModal.vue'
import SkeletonLoader from '../components/common/SkeletonLoader.vue'
import TransferModal from '../components/dashboard/TransferModal.vue'

const tourStore = useTourStore()
const expenseStore = useExpenseStore()
const authStore = useAuthStore()
const fundRequestStore = useFundRequestStore()
const contributionStore = useContributionStore()
const expenseRequestStore = useExpenseRequestStore()
const transferStore = useTransferStore()
const toastStore = useToastStore()

const isAddFundOpen = ref(false)
const isMembersOpen = ref(false)
const isTransferOpen = ref(false)
const selectedExpense = ref(null)
const fundAmount = ref(null)
const fundNote = ref('')
const fundLoading = ref(false)
const codeCopied = ref(false)

const uid = computed(() => authStore.user?.uid)

// Combined loading state
const isLoadingData = computed(() => tourStore.isLoading)
const myContributions = computed(() => contributionStore.myContributions(uid.value))
const myExpenses = computed(() => 
  expenseStore.groupExpenses.filter(e => e.paidBy === uid.value)
)
// My group spend (paid by me in group)
const myGroupSpend = computed(() => expenseStore.getMemberPaidAmount(uid.value))

// My total contribution: cash + pocket spend (if not admin) + net transfers
const myTotalContribution = computed(() => {
  const cash = contributionStore.myTotal(uid.value)
  const isAdmin = tourStore.currentTour?.adminId === uid.value
  const pocket = isAdmin ? 0 : myGroupSpend.value
  const netTx = transferStore.netTransfer(uid.value)
  return cash + pocket + netTx
})

// Total group contribution for balance
const totalContributionsSum = computed(() => {
  return tourStore.members.reduce((sum, m) => {
    const cash = contributionStore.contributionsByMember[m.uid] || 0
    const isAdmin = tourStore.currentTour?.adminId === m.uid
    const spent = expenseStore.getMemberPaidAmount(m.uid)
    const netTx = transferStore.netTransfer(m.uid)
    return sum + (isAdmin ? cash : (cash + spent)) + netTx
  }, 0)
})

const groupBalance = computed(() => totalContributionsSum.value - expenseStore.totalGroupSpent)

// My share (splitAmong-aware)
const myShare = computed(() => expenseStore.getMemberShare(uid.value, tourStore.activeMembers))

// Net balance: my contribution - my share
const myBalance = computed(() => myTotalContribution.value - myShare.value)

// My pending fund requests
const myPendingFundRequests = computed(() =>
  fundRequestStore.requests.filter(r => r.memberId === uid.value && r.status === 'pending')
)

// My pending expense requests
const myPendingExpenseRequests = computed(() =>
  expenseRequestStore.myPendingRequests(uid.value)
)


// Send fund request
const sendFundRequest = async () => {
  if (!fundAmount.value || fundAmount.value <= 0) return
  fundLoading.value = true
  try {
    const isOffline = !navigator.onLine
    const promise = addDoc(collection(firestore, "fund_requests"), {
      tourId: tourStore.tourId,
      memberId: uid.value,
      memberName: authStore.getUserName,
      amount: fundAmount.value,
      note: fundNote.value || '',
      status: 'pending',
      createdAt: new Date().toISOString()
    })
    
    isAddFundOpen.value = false
    fundAmount.value = null
    fundNote.value = ''
    
    if (isOffline) {
      toastStore.addToast("Request saved locally (Offline). Will sync when online.", 'info')
    } else {
      await promise
      toastStore.addToast("Fund request sent to Admin successfully!", 'success')
    }
  } catch (err) {
    console.error("Fund request error:", err)
    toastStore.addToast("Failed to send request. Try again.", 'error')
  } finally {
    fundLoading.value = false
  }
}

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(tourStore.inviteCode)
    codeCopied.value = true
    toastStore.addToast('Invite code copied!', 'success')
    setTimeout(() => codeCopied.value = false, 2000)
  } catch (e) {
    toastStore.addToast('Code: ' + tourStore.inviteCode, 'info')
  }
}

const fmt = (n) => Number(n || 0).toLocaleString('en-IN')
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
</script>

<style scoped>
@reference "tailwindcss";
.animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards; will-change: transform, opacity; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
