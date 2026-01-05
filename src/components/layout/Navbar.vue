<template>
  <nav class="navbar navbar-dark bg-dark px-3 fixed-top">
    <button class="btn btn-outline-light me-3" @click="$emit('toggleSidebar')">
      <i class="bi bi-list"></i>
    </button>
    <router-link to="/" class="navbar-brand mb-0 h5">Blog</router-link>
    <div class="ms-auto dropdown">
      <a class="d-flex align-items-center text-white text-decoration-none dropdown-toggle" href="#" role="button"
        id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
        <img
          :src="authStore.user.avatar"
          class="rounded-circle me-2 img-fluid" alt="avatar" width="40" height="40" />
        <span>{{ authStore.user.firstName }} {{ authStore.user.lastName }}</span>
      </a>

      <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
        <li><router-link class="dropdown-item" to="/profile"><i class="bi bi-person me-2"></i>Profile</router-link></li>
        <li>
          <hr class="dropdown-divider">
        </li>
        <li><a class="dropdown-item" href="#" @click.prevent="showModal = true"><i
              class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
      </ul>
    </div>
  </nav>
  <BaseModal v-if="showModal" title="Confirm Logout" @close="showModal = false">
    <p>Are you sure you want to log out?</p>
    <template #footer>
      <BaseButton @click="showModal = false" variant="secondary">Cancel</BaseButton>
      <BaseButton @click="handleLogout" variant="danger">
        {{ isLoading ? "Logging out..." : "Log Out" }}
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const showModal = ref(false);
const isLoading = ref(false);

onMounted(async() => {
  await authStore.fetchProfile()
})

defineEmits(['toggleSidebar']);

// Logout handler
const handleLogout = async () => {
  try {
    isLoading.value = true;
    await authStore.logout();
    router.push({ name: "login" });
  } catch (err) {
    console.error("Logout failed:", err);
  } finally {
    showModal.value = false;
    isLoading.value = false;
  }
};
</script>
<style scoped>
.profile-dropdown {
  color: #212529;
}

.profile-dropdown:focus,
.profile-dropdown:active,
.profile-dropdown:visited,
.profile-dropdown:hover {
  color: #212529;
  text-decoration: none;
  box-shadow: none;
  outline: none;
  
  background-color: rgba(255, 255, 255, 0.1)!important;
}

.dropdown-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #212529;
}

.dropdown-item:focus {
  outline: none;
  box-shadow: none;
}
</style>
