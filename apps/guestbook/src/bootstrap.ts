import { createApp } from 'vue';
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
} from 'vue-router';
import { routes } from './router';
import App from './App.vue';
import { useAuth } from './composables/useAuth';
import './style.css';

export interface MountOptions {
  /**
   * Federated 모드일 때 베이스 경로
   */
  basePath?: string;
}

export function mount(
  el: HTMLElement | string,
  options: MountOptions = {}
) {
  const { basePath = '/guestbook' } = options;

  // Federated 모드로 간주 (MemoryHistory 사용)
  const router = createRouter({
    history: createMemoryHistory(basePath),
    routes,
  });

  // Navigation Guard 설정
  router.beforeEach(async (to, _from, next) => {
    // requiresAuth가 true인 라우트에 대해 인증 확인
    if (to.meta.requiresAuth) {
      const { isAuthenticated, isAdmin } = useAuth();

      // 인증되지 않은 경우 로그인 페이지로 리다이렉트
      if (!isAuthenticated.value) {
        next({
          name: 'Login',
          query: { redirect: to.fullPath }, // 로그인 후 원래 페이지로 돌아가기 위해
        });
        return;
      }

      // 관리자 권한 확인
      const hasAdminAccess = await isAdmin();
      if (!hasAdminAccess) {
        // 관리자 권한이 없으면 메인 페이지로 리다이렉트
        next({ name: 'GuestbookList' });
        return;
      }
    }

    next();
  });

  // 라우터 네비게이션 발생 시 브라우저 URL 업데이트
  router.afterEach((to) => {
    const fullPath = basePath + to.fullPath;
    if (window.location.pathname !== fullPath) {
      window.history.pushState({}, '', fullPath);
    }
  });

  // 현재 브라우저 URL로 초기 라우팅
  const currentPath = window.location.pathname.replace(basePath, '') || '/';
  router.push(currentPath);

  // Vue 앱 생성
  const app = createApp(App);
  app.use(router);
  app.mount(el);

  return { app, router };
}

export function unmount(mountedApp: ReturnType<typeof mount>) {
  mountedApp.app.unmount();
}
