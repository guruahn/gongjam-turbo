import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'hello-world',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.vue',
      },
      shared: ['vue'],
    }),
  ],
  server: {
    port: 3001,
    open: true,
  },
  preview: {
    port: 3001,
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
});
