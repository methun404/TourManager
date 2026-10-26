import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { firestore } from "../services/firebase";

export const useContributionStore = defineStore("contribution", () => {
  const contributions = ref([]);
  const isLoading = ref(false);
  let unsubscribe = null;

  // Total contributed per member (map: uid -> total amount)
  const contributionsByMember = computed(() => {
    const map = {};
    contributions.value.forEach((c) => {
      if (!map[c.memberId]) map[c.memberId] = 0;
      map[c.memberId] += Number(c.amount || 0);
    });
    return map;
  });

  // Total contributions across all members
  const grandTotal = computed(() => {
    return contributions.value.reduce((sum, c) => sum + Number(c.amount || 0), 0);
  });

  // My contributions only (pass uid)
  function myContributions(uid) {
    return contributions.value.filter((c) => c.memberId === uid);
  }

  function myTotal(uid) {
    return myContributions(uid).reduce((sum, c) => sum + Number(c.amount || 0), 0);
  }

  function initContributionListener(tourId) {
    if (!tourId) return;
    if (unsubscribe) unsubscribe();

    isLoading.value = true;
    const q = query(collection(firestore, "contributions"), where("tourId", "==", tourId));

    unsubscribe = onSnapshot(q, (snapshot) => {
      let data = [];
      snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      contributions.value = data;
      isLoading.value = false;
    }, (err) => {
      console.error("Contribution listener error:", err);
      isLoading.value = false;
    });
  }

  function clearContributions() {
    if (unsubscribe) unsubscribe();
    contributions.value = [];
  }

  return {
    contributions,
    isLoading,
    contributionsByMember,
    grandTotal,
    myContributions,
    myTotal,
    initContributionListener,
    clearContributions,
  };
});
