import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import './style.css';

// Import router
import { routes } from './router';

// Create router instance
const router = createRouter({
  history: createWebHistory('/guestbook'),
  routes,
});

// Create and mount app
const app = createApp(App);
app.use(router);
app.mount('#app');
