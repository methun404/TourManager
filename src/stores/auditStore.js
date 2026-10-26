import { defineStore } from "pinia";
import { ref } from "vue";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  orderBy,
  limit,
} from "firebase/firestore";
import { firestore } from "../services/firebase";

export const useAuditStore = defineStore("audit", () => {
  const logs = ref([]);
  const isLoading = ref(false);
  let unsubscribe = null;

  function initAuditListener(tourId, limitCount = 50) {
    if (!tourId) return;
    if (unsubscribe) unsubscribe();

    isLoading.value = true;
    const q = query(
      collection(firestore, "audit_logs"),
      where("tourId", "==", tourId),
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );

    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let data = [];
        snapshot.forEach((d) => data.push({ id: d.id, ...d.data() }));
        logs.value = data;
        isLoading.value = false;
      },
      (err) => {
        console.error("Audit listener error:", err);
        isLoading.value = false;
      }
    );
  }

  /**
   * Write an audit log entry (invoked on edit or delete events)
   *
   * @param {object} params
   * @param {string} params.tourId
   * @param {'edit'|'delete'} params.action
   * @param {'expense'|'contribution'|'transfer'} params.entityType
   * @param {string} params.entityId
   * @param {string} params.changedBy - UID
   * @param {string} params.changedByName
   * @param {object} params.before - original data snapshot
   * @param {object|null} params.after - new data (null if deleted)
   */
  async function writeLog({
    tourId,
    action,
    entityType,
    entityId,
    changedBy,
    changedByName,
    before,
    after = null,
  }) {
    try {
      await addDoc(collection(firestore, "audit_logs"), {
        tourId,
        action,
        entityType,
        entityId,
        changedBy,
        changedByName,
        before,
        after,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      // Audit log failure non-critical — silently catch
      console.warn("Audit log write failed:", err);
    }
  }

  function clearLogs() {
    if (unsubscribe) unsubscribe();
    logs.value = [];
  }

  return {
    logs,
    isLoading,
    initAuditListener,
    writeLog,
    clearLogs,
  };
});
