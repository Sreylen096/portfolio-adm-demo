import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

import DashboardLayout from "@/layouts/DashboardLayout.vue";
import DashboardView from "@/views/DashboardView.vue";
import LoginView from "@/views/LoginView.vue";
import ArticleListView from "@/views/article/ArticleListView.vue";
import ArticleCreateView from "@/views/article/ArticleCreate.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: DashboardLayout,
      children: [
        {
          path: "",
          name: "dashboard",
          component: DashboardView,
          meta: { title: "Dashboard" },
        },
        {
          path: "article",
          meta: { title: "Article" },
          children: [
            {
              path: "",
              name: "article.index",
              component: ArticleListView,
            },
            {
              path: "create",
              name: "article.create",
              component: ArticleCreateView,
              meta: { title: "Create Article" },
            },
          ],
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: { title: "Login" },
    },
    // {
    //   path: "/:pathMatch(.*)*",
    //   name: "NotFound",
    //   component: NotFound,
    //   meta: { title: "404 Not Found" },
    // },
  ],
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  const hasToken = !!authStore.token;

  document.title = to.meta.title ? `${to.meta.title} - My Admin` : "My Admin";

  if (hasToken && !authStore.user) {
    try {
      await authStore.fetchUser();
    } catch (e) {
      authStore.logout();
      return { name: "login" };
    }
  }

  if (!hasToken && to.name !== "login") {
    return { name: "login" };
  }

  // if (hasToken && to.name === "login") {
  //   return { name: "dashboard" };
  // }

  return true;
});

export default router;
