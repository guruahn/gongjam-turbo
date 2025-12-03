import type { RouteRecordRaw } from 'vue-router';
import GuestbookListPage from './pages/GuestbookListPage.vue';
import GuestbookAdminPage from './pages/GuestbookAdminPage.vue';
import LoginPage from './pages/LoginPage.vue';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'GuestbookList',
    component: GuestbookListPage,
    meta: { title: '방명록' },
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { title: '로그인' },
  },
  {
    path: '/admin',
    name: 'GuestbookAdmin',
    component: GuestbookAdminPage,
    meta: {
      title: '방명록 관리',
      requiresAuth: true,
    },
  },
];
