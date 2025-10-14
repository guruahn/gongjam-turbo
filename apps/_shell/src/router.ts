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
];

export default routes;
