<template>
    <button :type="type" :class="buttonClasses" :disabled="disabled || loading" @click="$emit('click', $event)">
        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
        <slot>{{ label }}</slot>
    </button>
</template>

<script setup>
import { computed } from "vue";

// Props
const props = defineProps({
    label: { type: String, default: "" },
    type: { type: String, default: "button" },
    variant: { type: String, default: "primary" },
    size: { type: String, default: "" },
    block: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
});

const buttonClasses = computed(() => {
    let classes = ["btn", `btn-${props.variant}`];

    if (props.size) classes.push(`btn-${props.size}`);
    if (props.block) classes.push("w-100");
    if (props.loading) classes.push("disabled");

    return classes;
});
</script>
