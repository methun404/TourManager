import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { firestore } from "../services/firebase";

export const useTransferStore = defineStore("transfer", () => {
  const transfers = ref([]);
  const isLoading = ref(false);
  let unsubscribe = null;

  // Pending transfers (need approval)
  const pendingTransfers = computed(() =>
    transfers.value.filter((t) => t.status === "pending")
  );

  // Completed transfers
  const completedTransfers = computed(() =>
    transfers.value.filter((t) => t.status === "completed")
  );

  /**
   * Total transfer amount sent by a member
   */
  function sentByMember(uid) {
    return transfers.value
      .filter((t) => t.fromMemberId === uid && t.status === "completed")
      .reduce((s, t) => s + t.amount, 0);
  }

  /**
   * Total transfer amount received by a member
   */
  function receivedByMember(uid) {
    return transfers.value
      .filter((t) => t.toMemberId === uid && t.status === "completed")
      .reduce((s, t) => s + t.amount, 0);
  }

  /**
   * Member's net transfer effect: received - sent
   * Positive = net receiver, Negative = net sender
   */
  function netTransfer(uid) {
    return receivedByMember(uid) - sentByMember(uid);
  }

  function initTransferListener(tourId) {
    if (!tourId) return;
    if (unsubscribe) unsubscribe();

    isLoading.value = true;
    const q = query(
      collection(firestore, "transfers"),
      where("tourId", "==", tourId)
    );

    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let data = [];
        snapshot.forEach((d) => data.push({ id: d.id, ...d.data() }));
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        transfers.value = data;
        isLoading.value = false;
      },
      (err) => {
        console.error("Transfer listener error:", err);
        isLoading.value = false;
      }
    );
  }

  /**
   * Send a fund transfer between members
   * If requireApproval is true: status = 'pending', otherwise status = 'completed'
   */
  async function sendTransfer({
    tourId,
    fromMemberId,
    fromMemberName,
    toMemberId,
    toMemberName,
    amount,
    note,
    requireApproval = false,
  }) {
    const payload = {
      tourId,
      fromMemberId,
      fromMemberName,
      toMemberId,
      toMemberName,
      amount: Number(amount),
      note: note || "",
      status: requireApproval ? "pending" : "completed",
      createdAt: new Date().toISOString(),
    };

    if (!requireApproval) {
      payload.completedAt = new Date().toISOString();
    }

    return await addDoc(collection(firestore, "transfers"), payload);
  }

  /**
   * Admin approves a pending transfer
   */
  async function approveTransfer(transferId) {
    await updateDoc(doc(firestore, "transfers", transferId), {
      status: "completed",
      completedAt: new Date().toISOString(),
    });
  }

  /**
   * Admin rejects a pending transfer
   */
  async function rejectTransfer(transferId) {
    await updateDoc(doc(firestore, "transfers", transferId), {
      status: "rejected",
      rejectedAt: new Date().toISOString(),
    });
  }

  function clearTransfers() {
    if (unsubscribe) unsubscribe();
    transfers.value = [];
  }

  return {
    transfers,
    isLoading,
    pendingTransfers,
    completedTransfers,
    sentByMember,
    receivedByMember,
    netTransfer,
    initTransferListener,
    sendTransfer,
    approveTransfer,
    rejectTransfer,
    clearTransfers,
  };
});
