<template>
  <div class="d-flex justify-content-between mb-3">
    <h3>All articles</h3>
    <BaseButton variant="primary" @click="createArticle">Create New Article</BaseButton>
  </div>

  <div class="w-50 mb-3 position-relative">
    <BaseInput v-model="search" placeholder="Search articles..." />
    <button v-if="search"
      class="btn btn-sm position-absolute top-0 end-0 mt-1 me-2 d-flex align-items-center justify-content-center"
      @click="search = ''">
      <i class="bi bi-x-circle"></i>
    </button>

  </div>

  <div class="row">
    <template v-if="articleStore.isLoading">
      <div class="col-md-4 mb-4" v-for="n in 6" :key="n">
        <ArticleCardSkeleton />
      </div>
    </template>
    <template v-else-if="!articleStore.articles.length">
      <div class="col-12 text-center py-5">
        <NoData message="No articles found." />
      </div>
    </template>
    <template v-else>
      <div class="col-md-4 mb-4" v-for="article in articleStore.articles" :key="article.id">
        <ArticleCard v-if="article.id" :id="article.id" :thumbnail="article?.thumbnail" :title="article?.title"
          :content="article?.content" :avatar="article.creator?.avatar"
          :creatorName="`${article.creator?.firstName} ${article.creator?.lastName}`" />
      </div>
    </template>
  </div>
  <div class="d-flex justify-content-center mt-4" v-if="articleStore.articles.length && articleStore.hasMore">
    <BaseButton @click="articleStore.fetchMoreArticles(search)" :isLoading="articleStore.isLoading">
      <i class="bi bi-plus-circle pe-2"></i> {{ articleStore.isLoading ? 'Loading...' : 'Load More' }}
    </BaseButton>
  </div>
</template>



<script setup>
import { onMounted, watch, ref } from 'vue';
import ArticleCard from '@/components/common/ArticleCard.vue';
import { useArticleStore } from '@/stores/article';
import ArticleCardSkeleton from '@/components/common/ArticleCardSkeleton.vue';
import BaseButton from '@/components/ui/base/BaseButton.vue';
import { useRouter } from 'vue-router';
import NoData from '@/components/common/NoData.vue';

const router = useRouter()
const search = ref('')
const articleStore = useArticleStore();

onMounted(async () => {
  await articleStore.fetchArticles()
})

let timeout = null;
watch(search, (val) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    articleStore.fetchArticles(val);
  }, 300);
});


const createArticle = () => {
  router.push({ name: 'article.create' });
};

</script>
