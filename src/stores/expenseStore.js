import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { firestore } from "../services/firebase";

export const useExpenseStore = defineStore("expense", () => {
  // --- State ---
  const groupExpenses = ref([]); // List of all group expenses
  const personalExpenses = ref([]); // List of user's personal expenses
  const isLoading = ref(false);

  // --- Getters (Calculations) ---

  // 1. Total group expenses (excluding soft-deleted)
  const totalGroupSpent = computed(() => {
    return groupExpenses.value
      .filter(e => !e.isDeleted)
      .reduce((total, exp) => total + exp.amount, 0);
  });

  // 2. Summary of expenses grouped by category
  const getCategorySummary = computed(() => {
    const summary = {};
    groupExpenses.value
      .filter(e => !e.isDeleted)
      .forEach((exp) => {
        summary[exp.category] = (summary[exp.category] || 0) + exp.amount;
      });
    return summary;
  });

  // 3. User's personal total expenses
  const totalPersonalSpent = computed(() => {
    return personalExpenses.value
      .filter(e => !e.isDeleted)
      .reduce((total, exp) => total + exp.amount, 0);
  });

  // 4. Recent expenses (latest 5 expenses for dashboard)
  const recentExpenses = computed(() => {
    return [...groupExpenses.value.filter(e => !e.isDeleted)]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  });

  /**
   * Calculate member share for group expenses.
   * Uses splitAmong field if present, otherwise splits equally across all active members.
   *
   * @param {string} uid - Member UID
   * @param {string[]} allActiveUids - Array of all active (non-paused) member UIDs
   */
  const getMemberShare = (uid, allActiveUids = []) => {
    let totalShare = 0;
    groupExpenses.value
      .filter(e => !e.isDeleted)
      .forEach(exp => {
        if (exp.splitAmong && exp.splitAmong.length > 0) {
          // New system: check if this member is in splitAmong
          if (exp.splitAmong.includes(uid)) {
            totalShare += exp.amount / exp.splitAmong.length;
          }
        } else {
          // Backward compat: split equally among all active members
          const count = allActiveUids.length > 0 ? allActiveUids.length : 1;
          if (allActiveUids.includes(uid) || allActiveUids.length === 0) {
            totalShare += exp.amount / count;
          }
        }
      });
    return totalShare;
  };

  /**
   * Member's own paid expenses (in group)
   */
  const getMemberPaidAmount = (uid) => {
    return groupExpenses.value
      .filter(e => !e.isDeleted && e.paidBy === uid)
      .reduce((s, e) => s + e.amount, 0);
  };

  /**
   * Average share (simple — backward compat, for hero stats)
   */
  const getAverageSpent = (memberCount) => {
    return memberCount > 0 ? totalGroupSpent.value / memberCount : 0;
  };

  // --- Actions ---
  let unsubscribeExpenses = null;

  /**
   * Listen to group and personal expenses in real-time from Firestore
   */
  function initExpenseListener(tourId, currentUserId) {
    if (!tourId) return;

    if (unsubscribeExpenses) {
      unsubscribeExpenses();
    }

    isLoading.value = true;
    const q = query(
      collection(firestore, "expenses"),
      where("tourId", "==", tourId)
    );

    unsubscribeExpenses = onSnapshot(q, (querySnapshot) => {
      let allExpenses = [];
      querySnapshot.forEach((doc) => {
        allExpenses.push({ id: doc.id, ...doc.data() });
      });

      // Sort by date descending locally
      allExpenses.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));

      // Separate group and personal expenses
      groupExpenses.value = allExpenses.filter(e => !e.isPersonal);
      // Personal expenses: isPersonal true AND belongs to current user
      personalExpenses.value = allExpenses.filter(e => e.isPersonal && e.paidBy === currentUserId);

      isLoading.value = false;
    }, (err) => {
      console.error("Expense snapshot error:", err);
      isLoading.value = false;
    });
  }

  /**
   * Reset store data on tour switch or user logout
   */
  function clearExpenses() {
    if (unsubscribeExpenses) unsubscribeExpenses();
    groupExpenses.value = [];
    personalExpenses.value = [];
  }

  return {
    groupExpenses,
    personalExpenses,
    isLoading,
    totalGroupSpent,
    totalPersonalSpent,
    getAverageSpent,
    getCategorySummary,
    recentExpenses,
    getMemberShare,
    getMemberPaidAmount,
    initExpenseListener,
    clearExpenses,
  };
});
