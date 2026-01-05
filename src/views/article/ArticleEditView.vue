<template>
    <h3 class="mb-3">Edit Article</h3>
    <ArticleForm ref="articleFormRef" />
    <div class="d-flex justify-content-between mt-4">
        <RouterLink :to="{ name: 'article.index' }" class="btn btn-outline-secondary d-flex align-items-center gap-2">
            <i class="bi bi-arrow-left"></i>
            Back to Articles
        </RouterLink>
        <BaseButton variant="primary" :disabled="isLoading" @click="handleUpdate">
            <i class="bi bi-pencil"></i> {{ isLoading ? 'Updating...' : 'Update Article' }}
        </BaseButton>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ArticleForm from '@/components/form/ArticleForm.vue'
import { useArticleStore } from '@/stores/article'

const route = useRoute()
const router = useRouter()
const articleStore = useArticleStore()

const articleFormRef = ref(null)
const isLoading = ref(false)
const articleId = route.params.id

onMounted(async () => {
    await articleStore.fetchArticleById(articleId)
    const data = articleStore.article
    const editForm = articleFormRef.value.formData

    editForm.title = data.title
    editForm.categoryId = data.category?.id
    editForm.content = data.content
    articleFormRef.value.existingThumbnail = data.thumbnail || ''
})

const handleUpdate = async () => {
    const formRef = articleFormRef.value

    if (!formRef.validateForm()) return

    try {
        isLoading.value = true
        const form = formRef.formData
        await articleStore.editArticle(articleId, {
            title: form.title.trim(),
            categoryId: Number(form.categoryId),
            content: form.content.trim()
        })
        if (form.thumbnail instanceof File) {
            const uploadData = new FormData()
            uploadData.append('thumbnail', form.thumbnail)
            await articleStore.createThumbnail(articleId, uploadData)
        }
        router.push({ name: 'article.index' })
    } catch (err) {
        console.error('Update error:', err)
    } finally {
        isLoading.value = false
    }
}
</script>
