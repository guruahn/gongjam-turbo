import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isDevelopment = mode === 'development';

  return {
    plugins: [
      vue(),
      federation({
        name: 'shell',
        remotes: {
          helloWorld: !isDevelopment
            ? `${env.VITE_HELLO_HOME_URL}/hello-world/assets/remoteEntry.js`
            : 'http://localhost:3001/hello-world/assets/remoteEntry.js',
        },
        shared: ['vue', 'vue-router'],
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
