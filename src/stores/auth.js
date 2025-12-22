import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/api/api";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const token = ref(localStorage.getItem("token"));

  const login = async (payload) => {
    const res = await api.post("/auth/login", payload);

    token.value = res.data.data.token;
    localStorage.setItem("token", token.value);
  };

  const fetchUser = async () => {
    const res = await api.get("/auth/profile");
    user.value = res.data.data;
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
    user,
    token,
    login,
    fetchUser,
    logout,
  };
});
