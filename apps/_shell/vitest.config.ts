import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { federation } from '@module-federation/vite';

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'shell',
      remotes: {},
      shared: {
        vue: {},
        'vue-router': {},
      },
    }),
  ],
  test: {
    environment: 'happy-dom',
    globals: true,
  },
});
