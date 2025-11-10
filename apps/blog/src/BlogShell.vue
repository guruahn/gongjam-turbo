<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { bootstrap } from './bootstrap';

const mountPoint = ref<HTMLDivElement | null>(null);
let blogApp: ReturnType<typeof bootstrap> | null = null;

const props = defineProps<{
  mode: 'standalone' | 'federated';
}>();
onMounted(() => {
  if (!mountPoint.value) return;

  // Bootstrap을 사용해서 federated 모드로 초기화
  if (props.mode === 'federated') {
    blogApp = bootstrap({
      mode: 'federated',
      basePath: '/blog',
    });
    blogApp.mount(mountPoint.value);
  }
});

onBeforeUnmount(() => {
  if (props.mode === 'federated' && blogApp) {
    blogApp.unmount();
    blogApp = null;
  }
});
</script>

<template>
  <div ref="mountPoint" class="blog-shell"></div>
</template>

<style scoped>
.blog-shell {
  width: 100%;
  min-height: 100vh;
}
</style>
