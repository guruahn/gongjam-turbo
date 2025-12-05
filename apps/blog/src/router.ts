import { RouteRecordRaw } from 'vue-router';
import BlogListPage from './pages/BlogListPage.vue';
import BlogPostPage from './pages/BlogPostPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'BlogList',
    component: BlogListPage,
  },
  {
    path: '/tag/:tag',
    name: 'BlogTagFilter',
    component: BlogListPage,
    props: true,
  },
  {
    path: '/:slug',
    name: 'BlogPost',
    component: BlogPostPage,
    props: true,
  },
];

export default routes;
