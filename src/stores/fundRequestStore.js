import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { firestore } from "../services/firebase";

export const useFundRequestStore = defineStore("fundRequest", () => {
  const requests = ref([]);
  const isLoading = ref(false);
  let unsubscribeRequests = null;

  const pendingRequests = computed(() => {
    return requests.value.filter(req => req.status === 'pending');
  });

  const myRequests = computed(() => {
    // This will be useful if we want to show a user their own history
    return requests.value;
  });

  function initRequestsListener(tourId) {
    if (!tourId) return;
    if (unsubscribeRequests) {
      unsubscribeRequests();
    }
    
    isLoading.value = true;
    const q = query(
      collection(firestore, "fund_requests"), 
      where("tourId", "==", tourId)
    );
    
    unsubscribeRequests = onSnapshot(q, (querySnapshot) => {
      let allRequests = [];
      querySnapshot.forEach((doc) => {
        allRequests.push({ id: doc.id, ...doc.data() });
      });
      // Sort locally by date descending
      allRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      requests.value = allRequests;
      isLoading.value = false;
    }, (err) => {
      console.error("Fund request snapshot error:", err);
      isLoading.value = false;
    });
  }

  function clearRequests() {
    if (unsubscribeRequests) unsubscribeRequests();
    requests.value = [];
  }

  return {
    requests,
    pendingRequests,
    myRequests,
    isLoading,
    initRequestsListener,
    clearRequests,
  };
});
