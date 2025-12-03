import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('helloWorld/App'),
  },
  {
    path: '/hello',
    component: () => import('helloWorld/App'),
  },
  {
    path: '/home',
    component: () => import('helloWorld/App'),
  },
  {
    path: '/blog/:pathMatch(.*)*',
    component: () => import('blog/BlogShell'),
    props: { mode: 'federated', basePath: '/blog' },
  },
  {
    path: '/guestbook/:pathMatch(.*)*',
    component: () => import('guestbook/GuestbookShell'),
    props: { mode: 'federated', basePath: '/guestbook' },
  },
];

export default routes;
