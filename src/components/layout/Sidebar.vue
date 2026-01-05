<template>
  <aside class="sidebar" :class="{ closed: !isOpen }">
    <div class="p-3 pt-5">
      <h6 class="text-uppercase text-secondary mb-3">Admin</h6>

      <ul class="nav nav-pills flex-column gap-1">
        <li class="nav-item">
          <RouterLink to="/" class="nav-link" exact exact-active-class="active">
            <i class="bi bi-speedometer me-2"></i>Dashboard
          </RouterLink>
        </li>
        <li class="nav-item">
          <a class="nav-link d-flex justify-content-between align-items-center" href="#articleCollapse"
            data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="articleCollapse"
            :class="{ collapsed: !isArticleActive }">
            My Article
            <i class="bi bi-chevron-down"></i>
          </a>

          <div class="collapse" id="articleCollapse" :class="{ show: isArticleActive }">
            <ul class="nav flex-column ms-3 mt-1">
              <li class="nav-item">
                <RouterLink to="/article" class="nav-link" exact exact-active-class="active">
                  All Article
                </RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink to="/article/create" class="nav-link" exact exact-active-class="active">
                  Create Article
                </RouterLink>
              </li>
            </ul>
          </div>
        </li>
        <li class="nav-item">
          <RouterLink to="/category" class="nav-link" exact exact-active-class="active">
           <i class="bi bi-tags me-2"></i>Category
          </RouterLink>
        </li>
        <li class="nav-item mt-3">
          <a class="nav-link text-danger" href="#" @click.prevent="showModal = true">
            Logout
          </a>
        </li>
      </ul>
    </div>

    <BaseModal v-if="showModal" title="Confirm Logout" @close="showModal = false">
      <p>Are you sure you want to log out?</p>
      <template #footer>
        <BaseButton @click="showModal = false" variant="secondary">Cancel</BaseButton>
        <BaseButton @click="handleLogout" variant="danger">
          {{ isLoading ? "Logging out..." : "Log Out" }}
        </BaseButton>
      </template>
    </BaseModal>
  </aside>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const isOpen = defineProps({ isOpen: Boolean });

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const showModal = ref(false);
const isLoading = ref(false);

const isArticleActive = computed(() => route.path.startsWith("/article"));

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
.sidebar {
  position: fixed;
  top: 56px;
  left: 0;
  width: 250px;
  height: calc(100vh - 56px);
  background-color: #212529;
  transition: transform 0.3s ease;
  overflow-y: auto;
  padding-bottom: 1rem;
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
  border-radius: 0.25rem;
}

.nav-link.collapsed {
  background-color: transparent;
}

.nav-item .collapse .nav-link.active {
  background-color: #495057;
}
</style>
