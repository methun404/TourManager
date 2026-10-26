import { ref } from "vue";
import { firestore } from "@/services/firebase";
import { useAuth } from "./useAuth";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  query,
  where,
  getDocs,
  limit,
} from "firebase/firestore";

export function useTour() {
  const { user } = useAuth();
  const loading = ref(false);
  const error = ref(null);

  // 1. Generate unique 6-character invite code
  const generateInviteCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  /**
   * Create a new tour group (Create Tour)
   */
  const createTour = async (tourData) => {
    if (!user.value) return;

    loading.value = true;
    error.value = null;

    try {
      const tourId = crypto.randomUUID();
      const inviteCode = generateInviteCode();

      const newTour = {
        id: tourId,
        name: tourData.name,
        budget: tourData.budget || 0,
        inviteCode: inviteCode,
        adminId: user.value.uid,
        members: [user.value.uid], // Creator is the first member
        createdAt: new Date().toISOString(),
        status: "active",
      };

      // Save tour to Firestore
      await setDoc(doc(firestore, "tours", tourId), newTour);

      // Update tour ID in user profile (Optional but recommended)
      await updateDoc(doc(firestore, "users", user.value.uid), {
        currentTourId: tourId,
        tours: arrayUnion(tourId),
      });

      return newTour;
    } catch (err) {
      error.value = err.message;
      console.error("Error creating tour:", err);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Join an existing tour using an invite code (Join Tour)
   */
  const joinTourWithCode = async (code) => {
    if (!user.value) return;

    loading.value = true;
    error.value = null;

    try {
      // Find tour by invite code
      const q = query(
        collection(firestore, "tours"),
        where("inviteCode", "==", code.toUpperCase()),
        limit(1),
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("Invalid invite code. Please try again.");
      }

      const tourDoc = querySnapshot.docs[0];
      const tourId = tourDoc.id;

      // Add user to tour's member list
      await updateDoc(doc(firestore, "tours", tourId), {
        members: arrayUnion(user.value.uid),
      });

      // Set current tour ID on user's profile
      await updateDoc(doc(firestore, "users", user.value.uid), {
        currentTourId: tourId,
        tours: arrayUnion(tourId),
      });

      return { id: tourId, ...tourDoc.data() };
    } catch (err) {
      error.value = err.message;
      console.error("Error joining tour:", err);
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    createTour,
    joinTourWithCode,
  };
}
