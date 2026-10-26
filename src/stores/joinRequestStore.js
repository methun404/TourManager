import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc, getDocs, writeBatch } from "firebase/firestore";
import { firestore } from "../services/firebase";

export const useJoinRequestStore = defineStore("joinRequest", () => {
  const adminRequests = ref([]); // Admin sees these (all requests for their tour)
  const myRequests = ref([]);    // User sees these (their own requests)
  const isLoading = ref(false);

  let unsubAdmin = null;
  let unsubUser = null;

  // ===== Computed =====

  const pendingAdminRequests = computed(() =>
    adminRequests.value.filter((r) => r.status === "pending")
  );

  const myPendingRequests = computed(() =>
    myRequests.value.filter((r) => r.status === "pending")
  );

  const myApprovedRequest = computed(() =>
    myRequests.value.find((r) => r.status === "approved")
  );

  // ===== Listeners =====

  /**
   * Admin listener: watches all join requests for a specific tour
   */
  function initAdminListener(tourId) {
    if (!tourId) return;
    if (unsubAdmin) unsubAdmin();

    const q = query(
      collection(firestore, "join_requests"),
      where("tourId", "==", tourId)
    );

    unsubAdmin = onSnapshot(q, (snap) => {
      let data = [];
      snap.forEach((d) => data.push({ id: d.id, ...d.data() }));
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      adminRequests.value = data;
    }, (err) => {
      console.error("JoinRequest admin listener error:", err);
    });
  }

  /**
   * User listener: watches this user's own join requests (across all tours)
   */
  function initUserListener(userId) {
    if (!userId) return;
    if (unsubUser) unsubUser();

    const q = query(
      collection(firestore, "join_requests"),
      where("userId", "==", userId),
      where("status", "in", ["pending", "approved", "rejected"])
    );

    unsubUser = onSnapshot(q, (snap) => {
      let data = [];
      snap.forEach((d) => data.push({ id: d.id, ...d.data() }));
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      myRequests.value = data;
    }, (err) => {
      console.error("JoinRequest user listener error:", err);
    });
  }

  // ===== Actions =====

  /**
   * Send a join request to a tour (used by member when requireJoinApproval is true)
   */
  async function sendRequest({ tourId, tourName, userId, userName, userAvatar }) {
    // Check if there's already a pending request for this tour
    const existing = myRequests.value.find(
      (r) => r.tourId === tourId && r.status === "pending"
    );
    if (existing) throw new Error("already_pending");

    await addDoc(collection(firestore, "join_requests"), {
      tourId,
      tourName,
      userId,
      userName,
      userAvatar: userAvatar || "",
      status: "pending",
      createdAt: new Date().toISOString(),
    });
  }

  /**
   * Cancel a user's own pending request
   */
  async function cancelRequest(requestId) {
    await updateDoc(doc(firestore, "join_requests", requestId), {
      status: "cancelled",
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * Admin approves a request — joins the user to the tour,
   * then cancels all other pending requests from that user
   */
  async function approveRequest(request) {
    const batch = writeBatch(firestore);

    // 1. Update this request to approved
    batch.update(doc(firestore, "join_requests", request.id), {
      status: "approved",
      updatedAt: new Date().toISOString(),
    });

    // 2. Add user to tour members & contributions
    const tourRef = doc(firestore, "tours", request.tourId);
    const { arrayUnion } = await import("firebase/firestore");
    batch.update(tourRef, {
      members: arrayUnion(request.userId),
      [`contributions.${request.userId}`]: 0,
    });

    // 3. Update user's Firestore profile
    batch.update(doc(firestore, "users", request.userId), {
      currentTourId: request.tourId,
      role: "member",
    });

    await batch.commit();

    // 4. Cancel all other pending requests from this user (other tours)
    const otherPendingSnap = await getDocs(
      query(
        collection(firestore, "join_requests"),
        where("userId", "==", request.userId),
        where("status", "==", "pending")
      )
    );
    const cancelBatch = writeBatch(firestore);
    otherPendingSnap.forEach((d) => {
      if (d.id !== request.id) {
        cancelBatch.update(d.ref, {
          status: "cancelled",
          updatedAt: new Date().toISOString(),
        });
      }
    });
    if (!otherPendingSnap.empty) {
      await cancelBatch.commit();
    }
  }

  /**
   * Admin rejects a request
   */
  async function rejectRequest(requestId) {
    await updateDoc(doc(firestore, "join_requests", requestId), {
      status: "rejected",
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * Mark request as completed (used after user successfully auto-joins)
   */
  async function markRequestCompleted(requestId) {
    await updateDoc(doc(firestore, "join_requests", requestId), {
      status: "completed",
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * Clear all listeners (when user leaves a tour)
   */
  function clearAll() {
    if (unsubAdmin) { unsubAdmin(); unsubAdmin = null; }
    if (unsubUser) { unsubUser(); unsubUser = null; }
    adminRequests.value = [];
    myRequests.value = [];
  }

  return {
    adminRequests,
    myRequests,
    pendingAdminRequests,
    myPendingRequests,
    myApprovedRequest,
    isLoading,
    initAdminListener,
    initUserListener,
    sendRequest,
    cancelRequest,
    approveRequest,
    rejectRequest,
    markRequestCompleted,
    clearAll,
  };
});
