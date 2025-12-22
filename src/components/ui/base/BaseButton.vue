<template>
    <button :class="`btn btn-${variant}`" :disabled="isDisabled || isLoading" @click="handleClick">
        <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
        <slot></slot>
    </button>
</template>

<script setup>
const props = defineProps({
    variant: { type: String, default: "primary" },
    isLoading: { type: Boolean, default: false },
    isDisabled: { type: Boolean, default: false },
});

const emit = defineEmits(["click"]);

const handleClick = () => {
    if (!props.isDisabled && !props.isLoading) {
        emit("click");
    }
};
</script>

<style scoped>
.btn {
    font-weight: 600;
    border-radius: 0.5rem;
}

.btn-primary {
    background-color: #25397e;
    border-color: #25397e;
    color: #fff;
}
</style>
