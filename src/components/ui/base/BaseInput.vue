<template>
    <label v-if="label" :for="id" class="form-label">{{ label }}</label>
    <input :id="id" :type="type" :value="modelValue" :placeholder="placeholder"
        :class="['form-control', { 'is-invalid': error }]" :disabled="disabled" :required="required"
        @input="$emit('update:modelValue', $event.target.value)" @blur="$emit('blur')" />
    <div v-if="error" class="invalid-feedback">{{ error }}</div>
</template>

<script setup>
const props = defineProps({
    modelValue: [String, Number],
    label: String,
    placeholder: String,
    id: String,
    type: { type: String, default: "text" },
    error: String,
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue", "blur"]);
</script>
