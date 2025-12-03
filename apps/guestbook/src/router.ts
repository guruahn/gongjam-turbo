import type { RouteRecordRaw } from 'vue-router';
import GuestbookListPage from './pages/GuestbookListPage.vue';
import GuestbookAdminPage from './pages/GuestbookAdminPage.vue';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'GuestbookList',
    component: GuestbookListPage,
    meta: { title: '방명록' },
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
