import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  collection, query, where, onSnapshot, addDoc, updateDoc,
  deleteDoc, doc, arrayUnion, arrayRemove, serverTimestamp
} from 'firebase/firestore'
import { firestore } from '../services/firebase'

export const useAlertStore = defineStore('alert', () => {
  const alerts = ref([])
  const isLoading = ref(false)
  let unsubscribe = null

  // ===== Getters =====
  const activeAlerts = computed(() =>
    alerts.value
      .filter(a => a.status === 'active')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  )

  const endedAlerts = computed(() =>
    alerts.value
      .filter(a => a.status === 'ended')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  )

  const activePolls = computed(() =>
    activeAlerts.value.filter(a => a.type === 'poll')
  )

  const activeAnnouncements = computed(() =>
    activeAlerts.value.filter(a => a.type === 'announcement' || a.type === 'reminder')
  )

  const unreadCount = computed(() => activeAlerts.value.length)

  // ===== Actions =====

  function initListener(tourId) {
    if (!tourId) return
    if (unsubscribe) unsubscribe()

    isLoading.value = true
    const q = query(
      collection(firestore, 'alerts'),
      where('tourId', '==', tourId)
    )

    unsubscribe = onSnapshot(q, (snapshot) => {
      const data = []
      snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }))
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      alerts.value = data
      isLoading.value = false
    }, (err) => {
      console.error('Alert listener error:', err)
      isLoading.value = false
    })
  }

  async function createAlert(payload) {
    const docRef = await addDoc(collection(firestore, 'alerts'), {
      ...payload,
      status: 'active',
      createdAt: new Date().toISOString(),
    })
    return docRef.id
  }

  async function updateAlert(alertId, payload) {
    await updateDoc(doc(firestore, 'alerts', alertId), payload)
  }

  async function deleteAlert(alertId) {
    await deleteDoc(doc(firestore, 'alerts', alertId))
  }

  async function endAlert(alertId) {
    await updateDoc(doc(firestore, 'alerts', alertId), {
      status: 'ended',
      endedAt: new Date().toISOString()
    })
  }

  async function reactivateAlert(alertId) {
    await updateDoc(doc(firestore, 'alerts', alertId), {
      status: 'active',
      endedAt: null
    })
  }

  // Cast or retract a vote on a poll option
  // For single-choice: remove from all other options first, then add to target
  // For multiple-choice: toggle on target option
  async function castVote(alertId, optionId, uid, allowMultiple, currentOptions) {
    const alertRef = doc(firestore, 'alerts', alertId)

    if (!allowMultiple) {
      // Remove uid from ALL options first, then add to target
      const newOptions = currentOptions.map(opt => ({
        ...opt,
        votes: opt.votes ? opt.votes.filter(v => v !== uid) : []
      }))
      // Add vote to selected option
      const targetIdx = newOptions.findIndex(o => o.id === optionId)
      if (targetIdx !== -1) {
        newOptions[targetIdx].votes.push(uid)
      }
      await updateDoc(alertRef, { options: newOptions })
    } else {
      // Multiple choice: toggle the vote
      const newOptions = currentOptions.map(opt => {
        if (opt.id !== optionId) return opt
        const hasVoted = (opt.votes || []).includes(uid)
        return {
          ...opt,
          votes: hasVoted
            ? opt.votes.filter(v => v !== uid)
            : [...(opt.votes || []), uid]
        }
      })
      await updateDoc(alertRef, { options: newOptions })
    }
  }

  function clearAlerts() {
    if (unsubscribe) unsubscribe()
    alerts.value = []
  }

  return {
    alerts,
    activeAlerts,
    endedAlerts,
    activePolls,
    activeAnnouncements,
    unreadCount,
    isLoading,
    initListener,
    createAlert,
    updateAlert,
    deleteAlert,
    endAlert,
    reactivateAlert,
    castVote,
    clearAlerts,
  }
})
