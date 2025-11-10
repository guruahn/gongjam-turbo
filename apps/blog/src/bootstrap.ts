import { createApp } from 'vue';
import { createRouter, createMemoryHistory, createWebHistory } from 'vue-router';
import routes from './router';
import App from './App.vue';
import './style.css';

export interface BootstrapOptions {
  /**
   * Shell 앱에서 로드될 때는 MemoryHistory 사용
   * Standalone에서는 WebHistory 사용
   */
  mode?: 'standalone' | 'federated';
  /**
   * Federated 모드일 때 베이스 경로
   */
  basePath?: string;
  /**
   * 마운트할 DOM 엘리먼트 (selector 또는 element)
   */
  mountElement?: string | Element;
}

export function bootstrap(options: BootstrapOptions = {}) {
  const {
    mode = 'standalone',
    basePath = '/blog',
    mountElement = '#app',
  } = options;

  // Router 생성
  const router = createRouter({
    history:
      mode === 'federated'
        ? createMemoryHistory(basePath)
        : createWebHistory(),
    routes,
  });

  // Vue 앱 생성
  const app = createApp(App);
  app.use(router);

  // Federated 모드일 때는 현재 경로로 라우팅
  if (mode === 'federated') {
    const currentPath = window.location.pathname.replace(basePath, '') || '/';
    router.push(currentPath);
  }

  return {
    app,
    router,
    mount: (el?: string | Element) => app.mount(el || mountElement),
    unmount: () => app.unmount(),
  };
}
