import { createRouter, createWebHistory } from "vue-router";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import HomeView from "../views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import ArticleView from "@/views/ArticleView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: DashboardLayout,
      children: [
        {
          path: "",
          name: "home",
          component: HomeView,
          meta: {
            title: "Dashboard",
          },
        },
        {
          path: "article",
          name: "article",
          component: ArticleView,
          meta: {
            title: "Article",
          },
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
  ],
});

router.beforeEach((to, from) => {
  document.title = to.meta.title ? to.meta.title + " - My Admin" : "My Admin";
  return true; 
});

export default router;
