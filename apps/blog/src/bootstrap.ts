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
        ? createMemoryHistory()
        : createWebHistory(),
    routes,
  });

  // Federated 모드일 때 브라우저 URL과 동기화
  if (mode === 'federated') {
    // 라우터 네비게이션 발생 시 브라우저 URL 업데이트
    router.afterEach((to) => {
      const fullPath = basePath + to.fullPath;
      if (window.location.pathname !== fullPath) {
        window.history.pushState({}, '', fullPath);
      }
    });

    // 현재 브라우저 URL로 초기 라우팅
    const currentPath = window.location.pathname.replace(basePath, '') || '/';
    router.isReady().then(() => router.push(currentPath));
  }

  // Vue 앱 생성
  const app = createApp(App);
  app.use(router);

  return {
    app,
    router,
    mount: (el?: string | Element) => app.mount(el || mountElement),
    unmount: () => app.unmount(),
  };
}
