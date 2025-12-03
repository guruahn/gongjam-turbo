import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import { routes } from './router';
import './style.css';

export function mount(
  el: HTMLElement | string,
  { basePath = '/' }: { basePath?: string } = {}
) {
  const router = createRouter({
    history: createWebHistory(basePath),
    routes,
  });

  const app = createApp(App);
  app.use(router);
  app.mount(el);

  return { app, router };
}

export function unmount(app: ReturnType<typeof mount>) {
  app.app.unmount();
}
