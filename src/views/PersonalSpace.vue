<template>
  <div class="px-4 py-2 sm:px-6 animate-fade-in flex flex-col gap-5">

    <!-- Private Balance Card -->
    <div class="relative bg-gradient-to-br from-purple-600 to-fuchsia-700 rounded-3xl p-5 text-white shadow-xl shadow-purple-500/20 overflow-hidden">
      <div class="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
      <div class="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>

      <div class="relative z-10">
        <div class="flex justify-between items-start">
          <div>
            <div class="flex items-center gap-1.5 mb-1">
              <LockKeyhole class="w-3.5 h-3.5 text-purple-200" />
              <span class="text-purple-100 text-xs font-semibold uppercase tracking-wider">Private Space</span>
            </div>
            <h2 class="text-3xl font-extrabold tracking-tight">৳ {{ formatCurrency(totalPersonalSpent) }}</h2>
            <p class="text-[10px] text-purple-200 mt-1">{{ personalExpenses.length }} private expense(s)</p>
          </div>
          <div class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <WalletCards class="w-5 h-5 text-white" />
          </div>
        </div>
        <p class="text-[10px] text-purple-100 mt-4 font-medium leading-relaxed">
          These expenses are visible only to you and do not affect the group's total balance.
        </p>
      </div>
    </div>

    <!-- Add Personal Expense Button -->
    <button
      @click="isAddPersonalOpen = true"
      class="flex items-center justify-center gap-2 w-full py-3.5 bg-purple-50 dark:bg-purple-900/30 border border-purple-100 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/50 hover:border-purple-200 text-purple-700 dark:text-purple-400 font-bold rounded-2xl transition-all active:scale-95 shadow-sm"
    >
      <Plus class="w-5 h-5" />
      Log Private Expense
    </button>

    <!-- Personal Expense List -->
    <div class="flex flex-col">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wider">My Spending Log</h3>
        <span class="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2.5 py-1 rounded-md transition-colors">
          {{ personalExpenses.length }} Items
        </span>
      </div>

      <div class="flex flex-col">
        <ExpenseItem
          v-for="item in personalExpenses"
          :key="item.id"
          :expense="item"
          @view-details="openExpenseDetails"
        />
      </div>

      <div
        v-if="personalExpenses.length === 0"
        class="flex flex-col items-center justify-center p-8 bg-gray-50/50 dark:bg-slate-900/50 border border-dashed border-gray-200 dark:border-slate-800 rounded-2xl transition-colors"
      >
        <ReceiptText class="w-8 h-8 text-gray-300 dark:text-slate-600 mb-2" />
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">No private expenses logged.</p>
      </div>
    </div>

    <!-- Add Personal Expense Modal -->
    <ActionModal :isOpen="isAddPersonalOpen" title="Log Private Expense" @close="isAddPersonalOpen = false">
      <AddExpenseForm
        :submitting="isSaving"
        forcePersonal
        @cancel="isAddPersonalOpen = false"
        @submit-expense="handleSavePersonalExpense"
      />
    </ActionModal>

    <!-- Expense Details Modal -->
    <ActionModal :isOpen="!!selectedExpense" :title="selectedExpense?.title || 'Expense'" @close="selectedExpense = null">
      <div v-if="selectedExpense" class="flex flex-col gap-3">
        <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl transition-colors">
          <span class="text-sm text-gray-600 dark:text-gray-400">Amount</span>
          <span class="text-lg font-extrabold text-gray-800 dark:text-gray-100">৳ {{ formatCurrency(selectedExpense.amount) }}</span>
        </div>
        <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl transition-colors">
          <span class="text-sm text-gray-600 dark:text-gray-400">Category</span>
          <span class="text-sm font-bold capitalize text-gray-800 dark:text-gray-100">{{ selectedExpense.category }}</span>
        </div>
        <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl transition-colors">
          <span class="text-sm text-gray-600 dark:text-gray-400">Date</span>
          <span class="text-sm font-bold text-gray-800 dark:text-gray-100">{{ formatDate(selectedExpense.date || selectedExpense.createdAt) }}</span>
        </div>
        <div v-if="selectedExpense.note" class="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl transition-colors">
          <span class="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase block mb-1">Note</span>
          <span class="text-sm text-gray-700 dark:text-gray-300">{{ selectedExpense.note }}</span>
        </div>
        <div class="flex gap-2">
          <button @click="openEditExpense(selectedExpense)" class="flex-1 py-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-sm rounded-xl border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors flex items-center justify-center gap-1.5">
            <Pencil class="w-3.5 h-3.5" /> Edit
          </button>
          <button @click="deleteExpense(selectedExpense)" class="flex-1 py-2.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold text-sm rounded-xl border border-red-100 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
            Delete
          </button>
        </div>
      </div>
    </ActionModal>

    <!-- Edit Personal Expense Modal -->
    <ActionModal :isOpen="!!editingExpense" title="Edit Private Expense" @close="editingExpense = null">
      <div v-if="editingExpense" class="flex flex-col gap-4">
        <div>
          <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Title</label>
          <input v-model="editTitle" type="text" class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl outline-none text-sm text-gray-900 dark:text-gray-100 focus:border-purple-500 transition-colors" />
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Amount (৳)</label>
          <input v-model.number="editAmount" type="number" min="1" class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl outline-none font-bold text-lg text-gray-900 dark:text-gray-100 focus:border-purple-500 transition-colors" />
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Note</label>
          <input v-model="editNote" type="text" class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl outline-none text-sm text-gray-900 dark:text-gray-100 focus:border-purple-500 transition-colors" />
        </div>
        <button @click="saveEditExpense" :disabled="isEditing" class="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl disabled:opacity-60 flex justify-center items-center gap-2">
          <svg v-if="isEditing" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <span v-else>Save Changes</span>
        </button>
      </div>
    </ActionModal>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { WalletCards, LockKeyhole, Plus, ReceiptText, Pencil } from 'lucide-vue-next'
import { useExpenseStore } from '../stores/expenseStore'
import { useAuthStore } from '../stores/authStore'
import { useToastStore } from '../stores/toastStore'
import { firestore } from '../services/firebase'
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'

import ExpenseItem from '../components/expenses/ExpenseItem.vue'
import ActionModal from '../components/common/ActionModal.vue'
import AddExpenseForm from '../components/expenses/AddExpenseForm.vue'

const expenseStore = useExpenseStore()
const authStore = useAuthStore()
const toastStore = useToastStore()

const isAddPersonalOpen = ref(false)
const selectedExpense = ref(null)
const editingExpense = ref(null)
const isSaving = ref(false)
const isEditing = ref(false)

const editTitle = ref('')
const editAmount = ref(0)
const editNote = ref('')

const personalExpenses = computed(() => expenseStore.personalExpenses)
const totalPersonalSpent = computed(() => expenseStore.totalPersonalSpent)

const formatCurrency = (amount) => Number(amount || 0).toLocaleString('en-IN')
const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' }) : ''

const openExpenseDetails = (expense) => { selectedExpense.value = expense }

const handleSavePersonalExpense = async (expenseData) => {
  if (!authStore.userProfile.currentTourId) {
    toastStore.addToast("You must be in an active tour.", 'error')
    return
  }
  isSaving.value = true
  try {
    const isOffline = !navigator.onLine
    const promise = addDoc(collection(firestore, "expenses"), {
      title: expenseData.title,
      amount: expenseData.amount,
      category: expenseData.category,
      note: expenseData.note || '',
      isPersonal: true,
      date: expenseData.date || new Date().toISOString(),
      tourId: authStore.userProfile.currentTourId,
      paidBy: authStore.user.uid,
      paidByName: authStore.getUserName,
      createdAt: new Date().toISOString()
    })
    
    isAddPersonalOpen.value = false
    
    if (isOffline) {
      toastStore.addToast("Saved locally (Offline). Will sync when online.", 'info')
    } else {
      await promise
      toastStore.addToast("Expense saved successfully", 'success')
    }
  } catch (err) {
    console.error("Personal expense error:", err)
    toastStore.addToast("Failed to save. Please try again.", 'error')
  } finally {
    isSaving.value = false
  }
}

const deleteExpense = async (expense) => {
  if (!confirm(`Delete "${expense.title}"?`)) return
  try {
    await deleteDoc(doc(firestore, "expenses", expense.id))
    selectedExpense.value = null
    toastStore.addToast("Personal expense deleted", 'success')
  } catch (err) {
    console.error("Delete error:", err)
    toastStore.addToast("Could not delete expense.", 'error')
  }
}

const openEditExpense = (expense) => {
  editingExpense.value = expense
  editTitle.value = expense.title
  editAmount.value = expense.amount
  editNote.value = expense.note || ''
  selectedExpense.value = null
}

const saveEditExpense = async () => {
  if (!editingExpense.value) return
  if (!editTitle.value || editAmount.value <= 0) {
    toastStore.addToast("Please provide valid title and amount", 'warning')
    return
  }

  isEditing.value = true
  try {
    await updateDoc(doc(firestore, "expenses", editingExpense.value.id), {
      title: editTitle.value,
      amount: editAmount.value,
      note: editNote.value
    })
    editingExpense.value = null
    toastStore.addToast("Expense updated successfully", 'success')
  } catch (err) {
    console.error("Edit error:", err)
    toastStore.addToast("Failed to update expense", 'error')
  } finally {
    isEditing.value = false
  }
}
</script>

<style scoped>
@reference "tailwindcss";

.animate-fade-in {
  animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  will-change: transform, opacity;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>