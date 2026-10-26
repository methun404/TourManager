import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { firestore } from "../services/firebase";

export const useExpenseRequestStore = defineStore("expenseRequest", () => {
  const requests = ref([]);
  const isLoading = ref(false);
  let unsubscribe = null;

  const pendingRequests = computed(() =>
    requests.value.filter((r) => r.status === "pending")
  );

  function myRequests(uid) {
    return requests.value.filter((r) => r.paidBy === uid);
  }

  function myPendingRequests(uid) {
    return requests.value.filter((r) => r.paidBy === uid && r.status === "pending");
  }

  function initListener(tourId) {
    if (!tourId) return;
    if (unsubscribe) unsubscribe();

    isLoading.value = true;
    const q = query(
      collection(firestore, "expense_requests"),
      where("tourId", "==", tourId)
    );

    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let data = [];
        snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        requests.value = data;
        isLoading.value = false;
      },
      (err) => {
        console.error("ExpenseRequest listener error:", err);
        isLoading.value = false;
      }
    );
  }

  function clearRequests() {
    if (unsubscribe) unsubscribe();
    requests.value = [];
  }

  return {
    requests,
    pendingRequests,
    isLoading,
    myRequests,
    myPendingRequests,
    initListener,
    clearRequests,
  };
});
