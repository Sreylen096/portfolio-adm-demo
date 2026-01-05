<template>
    <h3 class="mb-3">Article Create</h3>

    <ArticleForm ref="articleFormRef" />

    <div class="d-flex flex-column flex-sm-row justify-content-sm-between my-3 gap-2">
        <RouterLink :to="{ name: 'article.index' }" class="btn btn-outline-secondary d-flex align-items-center gap-2">
            <i class="bi bi-arrow-left"></i>
            Back to Articles
        </RouterLink>

        <button class="btn btn-primary d-flex align-items-center gap-2" :disabled="isLoading" @click="handlePublish">
            <i class="bi bi-send-fill"></i>
            {{ isLoading ? 'Publishing...' : 'Publish Now' }}
        </button>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useArticleStore } from '@/stores/article'
import ArticleForm from '@/components/form/ArticleForm.vue'

const articleFormRef = ref(null)
const articleStore = useArticleStore()
const router = useRouter()

const isLoading = ref(false)

const handlePublish = async () => {
    const formRef = articleFormRef.value
    if (!formRef.validateForm()) return

    try {
        isLoading.value = true

        const form = formRef.formData

        const res = await articleStore.createArticle({
            title: form.title.trim(),
            categoryId: Number(form.categoryId),
            content: form.content.trim(),
        })

        const articleId = res.data.id

        if (form.thumbnail) {
            const formData = new FormData()
            formData.append('thumbnail', form.thumbnail)
            await articleStore.createThumbnail(articleId, formData)
        }

        formRef.resetForm()
        router.push({ name: 'article.index' })
    } catch (err) {
        console.error('Publish error:', err)
    } finally {
        isLoading.value = false
    }
}
</script>
