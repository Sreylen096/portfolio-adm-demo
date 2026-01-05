import { defineStore } from "pinia";
import api from "@/api/api";
import { ref } from "vue";

export const useArticleStore = defineStore("article", () => {
  const articles = ref([]);
  const article = ref(null);
  const my_article = ref([]);
  const isLoading = ref(false);
  const myLoading = ref(false);
  const page = ref(1);
  const hasMore = ref(true);

  const fetchArticles = async (searchQuery = "", isLoadMore = false) => {
    isLoading.value = true;
    try {
      const res = await api.get("articles", {
        params: {
          _page: page.value,
          _per_page: 9,
          sortBy: "createdAt",
          sortDir: "desc",
          search: searchQuery
        },
      });

      const items = res.data.data.items || [];
      if (isLoadMore) {
        articles.value.push(...items);
      } else {
        page.value = 1;
        articles.value = items;
      }

      hasMore.value = res.data.data.meta.hasNextPage === true;
    } catch (err) {
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchMoreArticles = async (searchQuery = "") => {
    if (!hasMore.value) return;

    page.value++;
    await fetchArticles(searchQuery, true);
  };

  const fetchArticleById = async (id) => {
    try {
      const res = await api.get(`/articles/${id}`);
      article.value = res.data.data;
    } catch (err) {
      console.error("Error fetching articles:", err);
    }
  };

  const fetchMyOwnArticle = async () => {
    myLoading.value = true;
    try {
      const res = await api.get("/articles/own", {
        params: {
          _page: page.value,
          _per_page: 10,
          sortBy: "createdAt",
          sortDir: "desc",
        },
      });
      my_article.value = res.data.data.items;
    } catch (err) {
      console.log("Error fetching my own article", err);
    } finally {
      myLoading.value = false;
    }
  };

  const createArticle = async (payload) => {
    try {
      const res = await api.post("/articles", payload);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const createThumbnail = async (id, payload) => {
    try {
      const res = await api.post(`/articles/${id}/thumbnail`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const editArticle = async (id, payload) => {
    try {
      const res = await api.put(`/articles/${id}`, payload);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const deleteArticle = async (id) => {
    try {
      const res = await api.delete(`/articles/${id}`);
      return res.data;
    } catch (err) {
      throw err.response?.data || err.message;
    }
  };

  return {
    articles,
    article,
    isLoading,
    myLoading,
    my_article,
    hasMore,
    fetchMoreArticles,
    fetchArticles,
    fetchArticleById,
    fetchMyOwnArticle,
    createArticle,
    createThumbnail,
    editArticle,
    deleteArticle,
  };
});
