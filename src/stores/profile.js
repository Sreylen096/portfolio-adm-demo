import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/api/api";
import { useAuthStore } from "./auth";

export const useProfileStore = defineStore("profile", () => {
  const isLoading = ref(false);
  const error = ref(null);

  /**
   * Update user profile information
   * @param {Object} profileData - { firstName, lastName, email }
   */
  const updateProfile = async (profileData) => {
    try {
      isLoading.value = true;
      error.value = null;

      const res = await api.put("/profile", profileData);

      // Update user data in auth store
      const authStore = useAuthStore();
      authStore.user = res.data.data;

      return res.data;
    } catch (err) {
      error.value = err.response?.data?.message || "Failed to update profile";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Upload profile avatar
   * @param {File} file - Image file to upload
   */
  const uploadAvatar = async (file) => {
    try {
      isLoading.value = true;
      error.value = null;

      const formData = new FormData();
      formData.append("avatar", file);

      const res = await api.post("/profile/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update user avatar in auth store
      const authStore = useAuthStore();
      if (authStore.user) {
        authStore.user.avatar = res.data.data.avatar;
      }

      return res.data;
    } catch (err) {
      error.value = err.response?.data?.message || "Failed to upload avatar";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Upload avatar from base64 data (for cropped images)
   * @param {string} base64Data - Base64 encoded image data
   */
  const uploadAvatarBase64 = async (base64Data) => {
    try {
      isLoading.value = true;
      error.value = null;

      // Convert base64 to blob
      const blob = await fetch(base64Data).then((res) => res.blob());
      const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });

      return await uploadAvatar(file);
    } catch (err) {
      error.value = err.response?.data?.message || "Failed to upload avatar";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Delete profile avatar
   */
  const deleteAvatar = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      const res = await api.delete("/profile/avatar");

      // Update user avatar in auth store to default
      const authStore = useAuthStore();
      if (authStore.user) {
        authStore.user.avatar = res.data.data.avatar || null;
      }

      return res.data;
    } catch (err) {
      error.value = err.response?.data?.message || "Failed to delete avatar";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Clear error state
   */
  const clearError = () => {
    error.value = null;
  };

  return {
    isLoading,
    error,
    updateProfile,
    uploadAvatar,
    uploadAvatarBase64,
    deleteAvatar,
    clearError,
  };
});
