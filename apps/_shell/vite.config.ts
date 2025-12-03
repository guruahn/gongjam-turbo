import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { federation } from '@module-federation/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isDevelopment = mode === 'development';

  return {
    plugins: [
      vue(),
      federation({
        name: 'shell',
        remotes: {
          helloWorld: {
            type: 'module',
            name: 'helloWorld',
            entry: !isDevelopment
              ? `${env.VITE_HELLO_HOME_URL}/remoteEntry.js`
              : 'http://localhost:3001/remoteEntry.js',
            entryGlobalName: 'helloWorld',
            shareScope: 'default',
          },
          blog: {
            type: 'module',
            name: 'blog',
            entry: !isDevelopment
              ? `${env.VITE_BLOG_URL}/remoteEntry.js`
              : 'http://localhost:3002/remoteEntry.js',
            entryGlobalName: 'blog',
            shareScope: 'default',
          },
          guestbook: {
            type: 'module',
            name: 'guestbook',
            entry: !isDevelopment
              ? `${env.VITE_GUESTBOOK_URL}/remoteEntry.js`
              : 'http://localhost:3003/remoteEntry.js',
            entryGlobalName: 'guestbook',
            shareScope: 'default',
          },
        },
        shared: {
          vue: {},
          'vue-router': {},
        },
      }),
    ],
    server: {
      port: 3000,
      open: true,
    },
    preview: {
      port: 3000,
    },
    build: {
      target: 'esnext',
      minify: false,
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          minifyInternalExports: false,
        },
      },
    },
  };
});
