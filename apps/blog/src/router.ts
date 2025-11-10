import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import BlogListPage from './pages/BlogListPage.vue';
import BlogPostPage from './pages/BlogPostPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'BlogList',
    component: BlogListPage,
  },
  {
    path: '/:slug',
    name: 'BlogPost',
    component: BlogPostPage,
    props: true,
  },
  {
    path: '/tag/:tag',
    name: 'BlogTagFilter',
    component: BlogListPage,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory('/blog'),
  routes,
});

export default router;
