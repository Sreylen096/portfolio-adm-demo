<template>
  <aside class="sidebar" :class="{ closed: !isOpen }">
    <div class="p-3 pt-5">
      <h6 class="text-uppercase text-secondary mb-3">Admin</h6>

      <ul class="nav nav-pills flex-column gap-1">
        <li class="nav-item">
          <RouterLink class="nav-link active" to="/">
            <i class="bi bi-speedometer me-2"></i>Dashboard
          </RouterLink>
        </li>
        <li class="nav-item">
          <a class="nav-link d-flex justify-content-between align-items-center" href="#articleCollapse"
            data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="articleCollapse">
            My Article
            <i class="bi bi-chevron-down"></i>
          </a>

          <div class="collapse" id="articleCollapse">
            <ul class="nav flex-column ms-3 mt-1">
              <li class="nav-item">
                <RouterLink class="nav-link" to="/article">All Article</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" to="/article/create">Create Article</RouterLink>
              </li>
            </ul>
          </div>
        </li>
        <li class="nav-item mt-3">
          <a class="nav-link text-danger" href="#" @click="showModal = true">
            Logout
          </a>
        </li>
      </ul>
    </div>
    <BaseModal v-if="showModal" title="Confirm Logout">
      <p>Are you sure you want to log out?</p>
      <template #footer>
        <BaseButton @click="showModal = false" variant="secondary">Cancel</BaseButton>
        <BaseButton @click="handleLogout" variant="danger">{{ isLoading ? "Logging out..." : "Log Out" }}</BaseButton>
      </template>
    </BaseModal>
  </aside>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const isOpen = defineProps({ isOpen: Boolean });

const showModal = ref(false);
const authStore = useAuthStore();
const router = useRouter();
const isLoading = ref(false);

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
.sidebar {
  position: fixed;
  top: 56px;
  left: 0;
  width: 250px;
  height: calc(100vh - 56px);
  background-color: #212529;
  transition: transform 0.3s ease;
  overflow-y: auto;
}

.sidebar.closed {
  transform: translateX(-250px);
}

.nav-link {
  color: #adb5bd;
}

.nav-link.active,
.nav-link:hover {
  color: #fff;
  background-color: #343a40;
}
</style>
