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
} from "firebase/firestore";
import { firestore } from "../services/firebase";

export const useExpenseGroupStore = defineStore("expenseGroup", () => {
  const groups = ref([]);
  const isLoading = ref(false);
  let unsubscribe = null;

  function initGroupListener(tourId) {
    if (!tourId) return;
    if (unsubscribe) unsubscribe();

    isLoading.value = true;
    const q = query(
      collection(firestore, "expense_groups"),
      where("tourId", "==", tourId)
    );

    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let data = [];
        snapshot.forEach((d) => data.push({ id: d.id, ...d.data() }));
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        groups.value = data;
        isLoading.value = false;
      },
      (err) => {
        console.error("ExpenseGroup listener error:", err);
        isLoading.value = false;
      }
    );
  }

  /**
   * Create a new expense group
   */
  async function createGroup({ tourId, name, members, color, createdBy, createdByName }) {
    return await addDoc(collection(firestore, "expense_groups"), {
      tourId,
      name,
      members, // [uid, uid, ...]
      color: color || "#6366f1",
      createdBy,
      createdByName,
      createdAt: new Date().toISOString(),
    });
  }

  /**
   * Update an existing expense group (member list or group name)
   */
  async function updateGroup(groupId, data) {
    await updateDoc(doc(firestore, "expense_groups", groupId), {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * Delete an expense group
   */
  async function deleteGroup(groupId) {
    await deleteDoc(doc(firestore, "expense_groups", groupId));
  }

  /**
   * Retrieve group member UIDs by group ID
   */
  function getGroupMembers(groupId) {
    const g = groups.value.find((g) => g.id === groupId);
    return g ? g.members : [];
  }

  function clearGroups() {
    if (unsubscribe) unsubscribe();
    groups.value = [];
  }

  return {
    groups,
    isLoading,
    initGroupListener,
    createGroup,
    updateGroup,
    deleteGroup,
    getGroupMembers,
    clearGroups,
  };
});
