<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { bootstrap } from './bootstrap';

const mountPoint = ref<HTMLDivElement | null>(null);
let blogApp: ReturnType<typeof bootstrap> | null = null;

const props = defineProps<{
  mode: 'standalone' | 'federated';
  basePath?: string;
}>();

// 브라우저의 뒤로가기/앞으로가기 처리
const handlePopState = () => {
  if (blogApp && props.mode === 'federated') {
    const basePath = props.basePath || '/blog';
    const currentPath = window.location.pathname.replace(basePath, '') || '/';
    blogApp.router.push(currentPath);
  }
};

onMounted(() => {
  if (!mountPoint.value) return;

  // Bootstrap을 사용해서 federated 모드로 초기화
  if (props.mode === 'federated') {
    blogApp = bootstrap({
      mode: 'federated',
      basePath: props.basePath || '/blog',
    });
    blogApp.mount(mountPoint.value);

    // popstate 이벤트 리스너 등록 (뒤로가기/앞으로가기)
    window.addEventListener('popstate', handlePopState);
  }
});

onBeforeUnmount(() => {
  if (props.mode === 'federated' && blogApp) {
    window.removeEventListener('popstate', handlePopState);
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
