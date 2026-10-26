import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { doc, onSnapshot, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../services/firebase";

export const useTourStore = defineStore("tour", () => {
  // --- State ---
  const currentTour = ref(null);
  const members = ref([]);
  const isLoading = ref(false);
  const isMembersLoading = ref(true);
  const error = ref(null);

  // --- Getters ---

  const tourId = computed(() => currentTour.value?.id || null);
  const tourName = computed(() => currentTour.value?.name || "No Active Tour");
  const isAdmin = (userId) => currentTour.value?.adminId === userId;
  const totalBudget = computed(() => currentTour.value?.budget || 0);
  const targetBudgetPerMember = computed(() => currentTour.value?.targetBudgetPerMember || 0);
  const inviteCode = computed(() => currentTour.value?.inviteCode || "");

  const showContributionAmounts = computed(() => {
    if (!currentTour.value) return true;
    return currentTour.value.showContributionAmounts !== false;
  });

  const allowMemberDownload = computed(() => {
    if (!currentTour.value) return false;
    return currentTour.value.allowMemberDownload !== false;
  });

  const allowMemberExpenseRequest = computed(() => {
    if (!currentTour.value) return false;
    return currentTour.value.allowMemberExpenseRequest !== false;
  });

  // Transfer approval required? (default: true = approval needed)
  const requireTransferApproval = computed(() => {
    if (!currentTour.value) return true;
    return currentTour.value.requireTransferApproval !== false;
  });

  /**
   * pausedMembers map: { [uid]: { pausedAt, resumedAt, balanceAtPause } }
   * Stored under tours/{tourId}.pausedMembers in Firestore
   */
  const pausedMembers = computed(() => currentTour.value?.pausedMembers || {});

  /**
   * Check whether a member is currently paused
   */
  const isMemberPaused = (uid) => {
    const pm = pausedMembers.value[uid];
    if (!pm) return false;
    // Paused and not yet resumed
    return pm.pausedAt && !pm.resumedAt;
  };

  /**
   * Active (non-paused) member UIDs list
   */
  const activeMembers = computed(() => {
    if (!currentTour.value?.members) return [];
    return currentTour.value.members.filter(uid => !isMemberPaused(uid));
  });

  /**
   * Active member profiles (excluding paused members)
   */
  const activeMemberProfiles = computed(() => {
    return members.value.filter(m => !isMemberPaused(m.uid));
  });

  let unsubscribeTour = null;

  /**
   * Listen to tour data in real-time from Firestore
   */
  function initTourListener(tourId) {
    if (!tourId) return;

    if (unsubscribeTour) {
      unsubscribeTour();
    }

    isLoading.value = true;
    const tourDocRef = doc(firestore, "tours", tourId);
    unsubscribeTour = onSnapshot(tourDocRef, (docSnap) => {
      if (docSnap.exists()) {
        currentTour.value = { id: docSnap.id, ...docSnap.data() };
      } else {
        error.value = "Tour not found";
      }
      isLoading.value = false;
    }, (err) => {
      console.error("Tour snapshot error:", err);
      error.value = err.message;
      isLoading.value = false;
    });
  }

  /**
   * Fetch full user profiles whenever members array changes
   */
  watch(() => currentTour.value?.members, async (newMembers) => {
    if (!newMembers || !newMembers.length) {
      members.value = [];
      return;
    }

    try {
      isMembersLoading.value = true;
      const fetchPromises = newMembers.map(async (uid) => {
        const userDocRef = doc(firestore, "users", uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          return { uid, ...userDoc.data() };
        } else {
          return { uid, name: "Unknown User", avatar: "" };
        }
      });

      members.value = await Promise.all(fetchPromises);
    } catch (err) {
      console.error("Error fetching member profiles:", err);
    } finally {
      isMembersLoading.value = false;
    }
  }, { immediate: true, deep: true });

  /**
   * Pause a member (Admin action)
   * balanceAtPause: Snapshot of member's current net balance
   */
  async function pauseMember(uid, balanceAtPause = 0) {
    if (!currentTour.value?.id) return;
    const tourRef = doc(firestore, "tours", currentTour.value.id);
    await updateDoc(tourRef, {
      [`pausedMembers.${uid}`]: {
        pausedAt: new Date().toISOString(),
        resumedAt: null,
        balanceAtPause,
      },
    });
  }

  /**
   * Resume a paused member (Admin action)
   */
  async function resumeMember(uid) {
    if (!currentTour.value?.id) return;
    const tourRef = doc(firestore, "tours", currentTour.value.id);
    await updateDoc(tourRef, {
      [`pausedMembers.${uid}.resumedAt`]: new Date().toISOString(),
    });
  }

  function setMembers(membersList) {
    members.value = membersList;
  }

  function getMemberName(uid) {
    const member = members.value.find((m) => m.uid === uid);
    return member ? member.name : "Unknown Member";
  }

  function updateTourDetails(updatedData) {
    if (currentTour.value) {
      currentTour.value = { ...currentTour.value, ...updatedData };
    }
  }

  function clearTour() {
    if (unsubscribeTour) unsubscribeTour();
    currentTour.value = null;
    members.value = [];
    error.value = null;
  }

  return {
    currentTour,
    members,
    isLoading,
    isMembersLoading,
    error,
    tourId,
    tourName,
    totalBudget,
    targetBudgetPerMember,
    inviteCode,
    showContributionAmounts,
    allowMemberDownload,
    allowMemberExpenseRequest,
    requireTransferApproval,
    pausedMembers,
    isMemberPaused,
    activeMembers,
    activeMemberProfiles,
    isAdmin,
    initTourListener,
    setMembers,
    getMemberName,
    updateTourDetails,
    pauseMember,
    resumeMember,
    clearTour,
  };
});
