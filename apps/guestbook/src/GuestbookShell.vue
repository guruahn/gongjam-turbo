<template>
  <div class="guestbook-shell">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter, RouterView } from 'vue-router';
import { routes } from './router';

interface Props {
  mode?: 'standalone' | 'federated';
  basePath?: string;
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'federated',
  basePath: '/guestbook',
});

const router = useRouter();

onMounted(() => {
  // In federated mode, ensure routes are registered
  if (props.mode === 'federated') {
    routes.forEach((route) => {
      if (!router.hasRoute(route.name as string)) {
        router.addRoute(route);
      }
    });
  }
});
</script>
