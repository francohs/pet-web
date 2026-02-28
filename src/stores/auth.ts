import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { authApi } from "@/api/auth";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(localStorage.getItem("token"));

  const isAuthenticated = computed(() => !!token.value);

  async function login(email: string, password: string) {
    const res = await authApi.login(email, password);
    token.value = res.data.access_token;
    localStorage.setItem("token", res.data.access_token);
  }

  async function register(name: string, email: string, password: string) {
    const res = await authApi.register(name, email, password);
    token.value = res.data.access_token;
    localStorage.setItem("token", res.data.access_token);
  }

  function logout() {
    token.value = null;
    localStorage.removeItem("token");
  }

  return { token, isAuthenticated, login, register, logout };
});
