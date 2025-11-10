import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { federation } from '@module-federation/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isDevelopment = mode === 'development';
  const baseUrl =
    !isDevelopment && env.VITE_BASE_URL ? env.VITE_BASE_URL + '/' : '/';

  return {
    base: baseUrl,
    plugins: [
      vue(),
      federation({
        name: 'blog',
        filename: 'remoteEntry.js',
        exposes: {
          './bootstrap': './src/bootstrap.ts',
          './BlogShell': './src/BlogShell.vue',
          './App': './src/App.vue',
          './BlogRouter': './src/router.ts',
          './BlogListPage': './src/pages/BlogListPage.vue',
          './BlogPostPage': './src/pages/BlogPostPage.vue',
        },
        shared: {
          vue: {},
          'vue-router': {},
        },
      }),
    ],
    server: {
      port: 3002,
      open: true,
    },
    preview: {
      port: 3002,
    },
    experimental: {
      renderBuiltUrl(
        filename: string,
        { hostType }: { hostType: 'js' | 'css' | 'html' }
      ) {
        // Production 빌드 시 절대 URL 사용
        if (!isDevelopment && baseUrl !== '/') {
          return baseUrl + filename;
        }
        return { relative: true };
      },
    },
    build: {
      modulePreload: true,
      target: 'esnext',
      minify: true,
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          minifyInternalExports: false,
        },
      },
    },
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  };
});
