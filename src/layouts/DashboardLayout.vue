<template>
  <div class="admin-layout">
    <Navbar @toggleSidebar="toggleSidebar" />
    <Sidebar :isOpen="sidebarOpen" />

    <!-- Main Content -->
    <main class="content mt-5" :class="{ expanded: !sidebarOpen }">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Navbar from '@/components/layout/Navbar.vue';
import Sidebar from '@/components/layout/Sidebar.vue';

const sidebarOpen = ref(true);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
}

.content {
  margin-left: 250px;
  padding: 1.5rem;
  transition: margin-left 0.3s ease;
}

.content.expanded {
  margin-left: 0;
}
</style>
