import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/LoginView.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("@/views/RegisterView.vue"),
    },
    {
      path: "/",
      name: "dashboard",
      component: () => import("@/views/DashboardView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/pets",
      name: "pets",
      component: () => import("@/views/PetsView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/pets/:id",
      name: "pet-detail",
      component: () => import("@/views/PetDetailView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/appointments",
      name: "appointments",
      component: () => import("@/views/AppointmentsView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/reminders",
      name: "reminders",
      component: () => import("@/views/RemindersView.vue"),
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: "login" };
  }
  if (
    (to.name === "login" || to.name === "register") &&
    authStore.isAuthenticated
  ) {
    return { name: "dashboard" };
  }
});

export default router;
