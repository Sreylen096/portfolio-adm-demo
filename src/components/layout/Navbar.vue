<template>
  <nav class="navbar navbar-dark bg-dark px-3 fixed-top">
    <button class="btn btn-outline-light me-3" @click="$emit('toggleSidebar')">
      <i class="bi bi-list"></i>
    </button>

    <span class="navbar-brand mb-0 h5">Portfolio</span>

    <div class="ms-auto d-flex align-items-center">
      <img
        src="https://thumbs.dreamstime.com/b/d-icon-avatar-cartoon-cute-freelancer-woman-working-online-learning-laptop-transparent-png-background-works-embodying-345422695.jpg"
        class="rounded-circle me-2 img-fluid" alt="avatar" width="40" height="40" />
      <span class="text-white">{{ authStore.user?.firstName}} {{ authStore.user?.lastName }}</span>
    </div>
  </nav>
</template>

<script setup>
defineEmits(['toggleSidebar']);

import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
</script>
