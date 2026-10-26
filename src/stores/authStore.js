import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../services/firebase";

export const useAuthStore = defineStore("auth", () => {
  // --- State ---
  const user = ref(null);
  const isAuthReady = ref(false);
  const userProfile = ref({
    name: "",
    email: "",
    avatar: "",
    currentTourId: null,
    role: "member",
  });

  // --- Getters ---
  const isLoggedIn = computed(() => !!user.value);

  const getUserName = computed(() => {
    return userProfile.value.name || user.value?.displayName || "User";
  });

  const getAvatar = computed(() => {
    return (
      userProfile.value.avatar ||
      `https://ui-avatars.com/api/?name=${getUserName.value}&background=random`
    );
  });

  // --- Actions ---

  /**
   * Set user and synchronize profile state from Firebase
   */
  async function setUser(firebaseUser) {
    user.value = firebaseUser;
    if (firebaseUser) {
      // Fetch additional profile data from Firestore
      try {
        const userDocRef = doc(firestore, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          userProfile.value = {
            name: data.name || firebaseUser.displayName,
            email: data.email || firebaseUser.email,
            avatar: data.avatar || "",
            currentTourId: data.currentTourId || null,
            role: data.role || "member",
          };
        } else {
          // Fallback if doc doesn't exist yet
          userProfile.value.name = firebaseUser.displayName;
          userProfile.value.email = firebaseUser.email;
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        userProfile.value.name = firebaseUser.displayName;
        userProfile.value.email = firebaseUser.email;
      }
    } else {
      resetStore();
    }
    isAuthReady.value = true;
  }

  /**
   * Update additional user profile fields in local state
   */
  function updateProfileData(data) {
    userProfile.value = { ...userProfile.value, ...data };
  }

  /**
   * Reset store state on logout or authentication error
   */
  function resetStore() {
    user.value = null;
    userProfile.value = {
      name: "",
      email: "",
      avatar: "",
      currentTourId: null,
      role: "member",
    };
  }

  /**
   * Helper to join user to a tour group
   * Updates Firestore document and synchronizes local state
   */
  async function joinTour(tourId) {
    if (!user.value) return;
    await updateDoc(doc(firestore, "users", user.value.uid), {
      currentTourId: tourId,
      role: "member",
    });
    updateProfileData({ currentTourId: tourId, role: "member" });
  }

  return {
    user,
    userProfile,
    isAuthReady,
    isLoggedIn,
    getUserName,
    getAvatar,
    setUser,
    updateProfileData,
    resetStore,
    joinTour,
  };
});
