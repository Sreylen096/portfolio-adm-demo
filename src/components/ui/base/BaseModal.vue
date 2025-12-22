<template>
    <div class="modal fade show" tabindex="-1" :style="{ display: show ? 'block' : 'none', backgroundColor: 'rgba(0,0,0,0.5)' }"
        @click.self="close">
        <div class="modal-dialog modal-dialog-centered" :class="sizeClass">
            <div class="modal-content">
                <!-- Header -->
                <div class="modal-header" v-if="title">
                    <h5 class="modal-title">{{ title }}</h5>
                    <button type="button" class="btn-close" @click="close"></button>
                </div>

                <!-- Body -->
                <div class="modal-body">
                    <slot />
                </div>

                <!-- Footer -->
                <div class="modal-footer" v-if="$slots.footer">
                    <slot name="footer"></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    show: { type: Boolean, default: false },
    title: String,
    size: { type: String, default: "" },
});

const emit = defineEmits(["update:show"]);

const close = () => emit("update:show", false);

const sizeClass = computed(() => {
    if (!props.size) return "";
    return `modal-${props.size}`;
});
</script>
