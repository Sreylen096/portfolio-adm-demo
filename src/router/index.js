import { createRouter, createWebHistory } from "vue-router";
import DashboardView from "../views/DashboardView.vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import LoginView from "@/views/LoginView.vue";
import ArticleListView from "@/views/article/ArticleListView.vue";
import ArticleCreateView from "@/views/article/ArticleCreateView.vue";
import ArticlePreviewView from "@/views/article/ArticlePreviewView.vue";
import ArticleEditView from "@/views/article/ArticleEditView.vue";
import CategoryView from "@/views/category/CategoryView.vue";
import ProfileView from "@/views/profile/ProfileView.vue";
import { useAuthStore } from "@/stores/auth.js";

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
          meta: {
            title: "Dashboard",
          },
        },
        {
          path: "article",
          meta: {
            title: "Article",
          },
          children: [
            {
              path: "",
              name: "article.index",
              component: ArticleListView,
            },
            {
              path: ":id",
              name: "article.preview",
              component: ArticlePreviewView,
              meta: {
                title: "Article Preview",
              },
            },
            {
              path: "create",
              name: "article.create",
              component: ArticleCreateView,
              meta: {
                title: "Article Create",
              },
            },
            {
              path: ":id/edit",
              name: "article.edit",
              component: ArticleEditView,
              meta: {
                title: "Article Edit",
              },
            },
          ],
        },
        {
          path: "category",
          name: "category.index",
          component: CategoryView,
          meta: {
            title: "Category List"
          }
        },
        {
          path: "profile",
          name: "profile.index",
          component: ProfileView,
          meta: {
            title: "Profile View"
          }
        }
      ],
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
  ],
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();
  document.title = to.meta.title ? `${to.meta.title} - My Admin` : "My Admin";

  if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchProfile();
    } catch (e) {
      authStore.logout();
      return { name: "login" };
    }
  }

  if (!authStore.isAuthenticated && to.name !== "login") {
    return { name: "login" };
  }
  if (authStore.isAuthenticated && to.name === "login") {
    return { name: "dashboard" };
  }

  return true;
});
export default router;
