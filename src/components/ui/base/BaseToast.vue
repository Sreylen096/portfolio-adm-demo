<template>
    <div v-if="show" class="toast" :class="`toast-${variant}`" @mouseenter="pauseTimer" @mouseleave="startTimer">
        <div class="toast-body">{{ message }}</div>
        <button type="button" class="btn-close" @click="hide"></button>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
    message: String,
    show: Boolean,
    variant: { type: String, default: "success" }, // success, danger, info, warning
});

const emit = defineEmits(["update:show"]);

let timer = null;

const hide = () => {
    emit("update:show", false);
    clearTimeout(timer);
};

const startTimer = () => {
    clearTimeout(timer);
    timer = setTimeout(() => hide(), 3000);
};

const pauseTimer = () => {
    clearTimeout(timer);
};

watch(() => props.show, (val) => {
    if (val) startTimer();
});

onBeforeUnmount(() => clearTimeout(timer));
</script>

<style scoped>
.toast {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 1055;
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    border-radius: 0.25rem;
    color: #fff;
    min-width: 200px;
    box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.1);
    opacity: 0;
    transform: translateY(-20px);
    transition: all 0.3s ease;
}

.toast-success {
    background-color: #28a745;
}

.toast-danger {
    background-color: #dc3545;
}

.toast-info {
    background-color: #17a2b8;
}

.toast-warning {
    background-color: #ffc107;
    color: #212529;
}

.toast-body {
    flex: 1;
}

.toast.show {
    opacity: 1;
    transform: translateY(0);
}

.btn-close {
    background: transparent;
    border: none;
    color: inherit;
    font-size: 1.2rem;
    cursor: pointer;
}
</style>
