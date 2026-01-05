<template>
    <div class="container py-5">
        <div v-if="isLoading">
            <h1 class="placeholder-glow mb-3">
                <span class="bg-secondary placeholder col-6 rounded"></span>
            </h1>

            <div class="placeholder-glow mb-4">
                <span class="bg-secondary placeholder col-12 rounded-5" style="height: 360px; display: block;"></span>
            </div>

            <div class="d-flex align-items-center gap-3 mb-4">
                <span class="bg-secondary placeholder rounded-circle" style="width:40px; height:40px;"></span>
                <span class="bg-secondary placeholder col-3 rounded"></span>
            </div>

            <div>
                <p class="placeholder-glow mb-2"><span class="bg-secondary placeholder col-12 rounded"></span></p>
                <p class="placeholder-glow mb-2"><span class="bg-secondary placeholder col-10 rounded"></span></p>
                <p class="placeholder-glow mb-2"><span class="bg-secondary placeholder col-8 rounded"></span></p>
            </div>
        </div>
        <div v-else>
            <h3 class="fw-bold mb-3">{{ articleStore.article?.title }}</h3>

            <img :src="articleStore.article?.thumbnail" class="rounded-4 shadow-sm mb-4" alt="thumbnail" width="1200px"
                height="500px" />

            <div v-if="articleStore.article?.creator" class="d-flex align-items-center gap-3 mb-4">
                <img :src="articleStore.article.creator.avatar" class="rounded-circle shadow-sm" width="40" height="40" />
                <div>
                    <div class="fw-semibold">{{ articleStore.article.creator.name }}</div>
                    <small class="text-muted">{{ formatDate(articleStore.article.createdAt) }}</small>
                </div>
            </div>


            <div class="article-content">{{ articleStore.article?.content }}</div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useArticleStore } from "@/stores/article";
import { formatDate } from "@/utils/dateFormat";

const route = useRoute();
const articleStore = useArticleStore();
const isLoading = ref(false);

onMounted(async () => {
    isLoading.value = true;
    try {
        await articleStore.fetchArticleById(route.params.id);
    } finally {
        isLoading.value = false;
    }
});
</script>


