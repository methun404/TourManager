import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { auth } from "@/services/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

// Global reactive state variables
const user = ref(null);
const error = ref(null);
const loading = ref(false);
const isAuthReady = ref(false);

export function useAuth() {
  const router = useRouter();

  /**
   * Create new user account (Signup)
   */
  const signup = async (email, password, displayName) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      if (!res) throw new Error("Could not complete signup");

      // Update user display name
      await updateProfile(res.user, { displayName });

      user.value = res.user;
      router.push("/welcome");
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  /**
   * User login logic (Login)
   */
  const login = async (email, password) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      user.value = res.user;
      router.push("/dashboard");
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  /**
   * User logout logic (Logout)
   */
  const logout = async () => {
    loading.value = true;
    try {
      await signOut(auth);
      user.value = null;
      router.push("/login");
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  // Check user session on app load
  // Runs once to verify whether user is already logged in
  onAuthStateChanged(auth, (_user) => {
    user.value = _user;
    isAuthReady.value = true;
  });

  return {
    user,
    error,
    loading,
    isAuthReady,
    signup,
    login,
    logout,
  };
}
