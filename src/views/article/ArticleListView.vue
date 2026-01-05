<template>
    <div class="d-flex justify-content-between mb-3">
        <h3>All articles</h3>
        <BaseButton variant="primary" @click="createArticle">Create New Article</BaseButton>
    </div>
    <BaseTable :columns="columns" :items="articleStore.my_article" :isLoading="articleStore.myLoading" @edit="onEdit"
        @delete="onDelete">
        <template #column-title="{ item }">
            <span class="fw-medium line-clamp-1 ">{{ item.title }}</span>
        </template>
        <template #column-category="{ item }">
            <span style="display:inline-block; min-width:160px;">
                {{ item.category?.name }}
            </span>
        </template>
        <template #column-content="{ item }">
            <span class=" line-clamp-1">{{ item.content }}</span>
        </template>
        <template #column-thumbnail="{ item }">
            <img :src="item.thumbnail" :alt="item.title" width="120px" height="70px" class="rounded">
        </template>
    </BaseTable>

    <BaseModal v-if="showModal" title="Confirm Delete" @close="showModal = false">
        <p>Are you sure you want to delete this article?</p>
        <template #footer>
            <BaseButton @click="showModal = false" variant="secondary">Cancel</BaseButton>
            <BaseButton @click="handleDelete" variant="danger">
                {{ isLoading ? "Deleting..." : "Delete" }}
            </BaseButton>
        </template>
    </BaseModal>

</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useArticleStore } from '@/stores/article'

// const loading = ref(false)
const router = useRouter()
const articleStore = useArticleStore()
const showModal = ref(false)
const selectedId = ref(null)
const isLoading = ref(false)

onMounted(async () => {
    await articleStore.fetchMyOwnArticle()
})

const columns = [
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category' },
    { key: 'content', label: 'Content' },
    { key: 'thumbnail', label: 'Thumbnail' },
]

const onEdit = (id) => {
    router.push({ name: 'article.edit', params: { id } })
}

const onDelete = (id) => {
    selectedId.value = id
    showModal.value = true
}

const handleDelete = async () => {
    if (!selectedId.value) return

    try {
        isLoading.value = true
        await articleStore.deleteArticle(selectedId.value)
        await articleStore.fetchMyOwnArticle()

        showModal.value = false
        selectedId.value = null
    } catch (err) {
        console.error('Delete error:', err)
    } finally {
        isLoading.value = false
    }
}


const createArticle = () => {
    router.push({ name: 'article.create' });
};
</script>
