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
    props: { mode: 'federated' },
  },
];

export default routes;
