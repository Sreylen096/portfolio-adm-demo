<template>
    <div class="d-flex justify-content-between mb-3">
        <h3>All Categories</h3>
        <BaseButton variant="primary" @click="openCreate">
            Create New Category
        </BaseButton>
    </div>

    <BaseTable :columns="columns" :items="categoryStore.categories" :isLoading="categoryStore.isLoading"
        @edit="openEdit" @delete="openDelete">
        <template #column-name="{ item }">
            <span class="fw-medium">{{ item.name }}</span>
        </template>
    </BaseTable>
    <BaseModal v-if="showModal" :title="isEdit ? 'Edit Category' : 'Create Category'" @close="closeModal">
        <BaseInput label="Category Name" v-model="form.name" placeholder="Enter category name" :error="errors.name"
            @blur="validateField('name', form.name, 'Category name is required')" />

        <template #footer>
            <BaseButton variant="secondary" @click="closeModal">Cancel</BaseButton>
            <BaseButton variant="primary" :disabled="categoryStore.isLoading" @click="handleSubmit">
                {{ categoryStore.isLoading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update' : 'Create')
                }}
            </BaseButton>
        </template>
    </BaseModal>
    <BaseModal v-if="showDelete" title="Confirm Delete" @close="closeDelete">
        <p>Are you sure you want to delete this category?</p>
        <template #footer>
            <BaseButton variant="secondary" @click="closeDelete">Cancel</BaseButton>
            <BaseButton variant="danger" @click="handleDelete">
                {{ categoryStore.isLoading ? 'Deleting...' : 'Delete' }}
            </BaseButton>
        </template>
    </BaseModal>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCategoryStore } from '@/stores/category';
import { useRequiredValidator } from '@/composables/useRequiredValidator';

const categoryStore = useCategoryStore();
const { errors, validateField } = useRequiredValidator();

const columns = [{ key: 'name', label: 'Name' }];

const showModal = ref(false);  
const isEdit = ref(false);      
const showDelete = ref(false);

const form = ref({ name: '' });
const selectedId = ref(null);

onMounted(() => {
    categoryStore.fetchCategories();
});

const openCreate = () => {
    isEdit.value = false;
    form.value.name = '';
    errors.name = '';
    showModal.value = true;
};

const openEdit = async (id) => {
    isEdit.value = true;
    selectedId.value = id;
    errors.name = '';
    showModal.value = true;

    const category = await categoryStore.fetchCategoryById(id);
    if (category) {
        form.value.name = category.name;
    }
};

const closeModal = () => {
    showModal.value = false;
};

const handleSubmit = async () => {
    const isValid = validateField('name', form.value.name, 'Category name is required');
    if (!isValid) return;

    if (isEdit.value) {
        await categoryStore.editCategory(selectedId.value, form.value);
    } else {
        await categoryStore.createCategory(form.value);
    }

    await categoryStore.fetchCategories();
    closeModal();
};

const openDelete = (id) => {
    selectedId.value = id;
    showDelete.value = true;
};

const closeDelete = () => {
    showDelete.value = false;
};

const handleDelete = async () => {
    await categoryStore.deleteCategory(selectedId.value);
    await categoryStore.fetchCategories();
    closeDelete();
};
</script>
