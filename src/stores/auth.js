import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "@/api/api";

export const useAuthStore = defineStore("auth", () => {

  const token = ref(localStorage.getItem("token"));
  const user = ref(null);

  const isAuthenticated = computed(() => !!token.value && !!user.value);

  const login = async (payload) => {
    const res = await api.post("/auth/login", payload);

    token.value = res.data.data.token;
    localStorage.setItem("token", token.value);

    await fetchProfile();
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/profile");
      user.value = res.data.data;
    } catch (error) {
      clearAuth();
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.delete("/auth/logout");
    } finally {
      clearAuth();
    }
  };

  const clearAuth = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem("token");
  };

  return {
    token,
    user,
    isAuthenticated,

    login,
    fetchProfile,
    logout,
    clearAuth,
  };
});
