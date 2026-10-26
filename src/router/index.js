import { createRouter, createWebHistory } from "vue-router";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// Configure NProgress
NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.2 });

// Layouts Import
import AppLayout from "../layouts/AppLayout.vue";
import AuthLayout from "../layouts/AuthLayout.vue";

// Views Import (Lazy Loading)
const Login = () => import("../views/Login.vue");
const Register = () => import("../views/Register.vue");
const WelcomeGroup = () => import("../views/Welcome.vue");
const Dashboard = () => import("../views/Dashboard.vue");
const PersonalSpace = () => import("../views/PersonalSpace.vue");
const Settings = () => import("../views/Settings.vue");
const AlertsView = () => import("../views/AlertsView.vue");

const routes = [
  // Auth Routes
  {
    path: "/auth",
    component: AuthLayout,
    redirect: "/login",
    meta: { requiresGuest: true },
    children: [
      { path: "/login", name: "Login", component: Login },
      { path: "/register", name: "Register", component: Register },
    ],
  },

  // App Routes
  {
    path: "/",
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "", redirect: "/dashboard" },
      {
        path: "welcome",
        name: "WelcomeGroup",
        component: WelcomeGroup,
        meta: { title: "Create or Join" },
      },
      {
        path: "dashboard",
        name: "Dashboard",
        component: Dashboard,
        meta: { title: "Dashboard" },
      },
      {
        path: "personal",
        name: "PersonalSpace",
        component: PersonalSpace,
        meta: { title: "Personal Space" },
      },
      {
        path: "settings",
        name: "Settings",
        component: Settings,
        meta: { title: "Settings" },
      },
      {
        path: "alerts",
        name: "Alerts",
        component: AlertsView,
        meta: { title: "Alerts" },
      },
    ],
  },

  // Catch All
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: "smooth" };
  },
});

// Navigation Guards
import { useAuthStore } from "../stores/authStore";

router.beforeEach(async (to, from) => {
  NProgress.start();
  
  const authStore = useAuthStore();
  const isLoggedIn = authStore.isLoggedIn;
  const userRole = authStore.userProfile.role || "member";
  const hasTour = !!authStore.userProfile.currentTourId;

  // 1. Auth Guard: not logged in, trying to access protected route
  if (to.matched.some((record) => record.meta.requiresAuth) && !isLoggedIn) {
    return "/login";
  }

  // 2. Guest Guard: already logged in, trying to access login/register
  if (to.matched.some((record) => record.meta.requiresGuest) && isLoggedIn) {
    return hasTour ? "/dashboard" : "/welcome";
  }

  // 3. Admin Guard: non-admin trying admin-only route
  if (to.matched.some((record) => record.meta.requiresAdmin) && userRole !== "admin") {
    alert("Access Denied: Only Admins can view this page.");
    return "/dashboard";
  }

  // 4. Logged in but no active tour → force /welcome
  if (
    isLoggedIn &&
    !hasTour &&
    to.name !== "WelcomeGroup" &&
    to.matched.some((record) => record.meta.requiresAuth)
  ) {
    return "/welcome";
  }
});

// Dynamic Page Title
router.afterEach((to) => {
  const defaultTitle = "Tour Manager";
  document.title = to.meta.title ? `${to.meta.title} | ${defaultTitle}` : defaultTitle;
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
