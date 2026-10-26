import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { auth } from "./services/firebase";
import { onAuthStateChanged } from "firebase/auth";

// Global CSS Import (Tailwind v4 settings included)
import "./assets/main.css";

/**
 * Create and configure Vue application instance
 */
const app = createApp(App);
const pinia = createPinia();

// Register Pinia state management
app.use(pinia);

import { useAuthStore } from "./stores/authStore";

// Wait for Firebase Auth to initialize before mounting the app
let appMounted = false;
onAuthStateChanged(auth, async (user) => {
  const authStore = useAuthStore(pinia);
  await authStore.setUser(user);
  if (!appMounted) {
    app.use(router);
    app.mount("#app");
    appMounted = true;
  }
});
/**
 * Global Error Handling
 * Captures unhandled application errors and logs them to console
 */
app.config.errorHandler = (err, vm, info) => {
  console.error("Global Error Handler:", err, info);
};
