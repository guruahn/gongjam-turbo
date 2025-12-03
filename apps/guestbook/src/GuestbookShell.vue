<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { mount, unmount } from './bootstrap';

const mountPoint = ref<HTMLDivElement | null>(null);
let guestbookApp: ReturnType<typeof mount> | null = null;

const props = defineProps<{
  mode: 'standalone' | 'federated';
  basePath?: string;
}>();

// 브라우저의 뒤로가기/앞으로가기 처리
const handlePopState = () => {
  if (guestbookApp && props.mode === 'federated') {
    const basePath = props.basePath || '/guestbook';
    const currentPath = window.location.pathname.replace(basePath, '') || '/';
    guestbookApp.router.push(currentPath);
  }
};

onMounted(() => {
  if (!mountPoint.value) return;

  // Bootstrap을 사용해서 federated 모드로 초기화
  if (props.mode === 'federated') {
    guestbookApp = mount(mountPoint.value, {
      basePath: props.basePath || '/guestbook',
    });

    // popstate 이벤트 리스너 등록 (뒤로가기/앞으로가기)
    window.addEventListener('popstate', handlePopState);
  }
});

onBeforeUnmount(() => {
  if (props.mode === 'federated' && guestbookApp) {
    window.removeEventListener('popstate', handlePopState);
    unmount(guestbookApp);
    guestbookApp = null;
  }
});
</script>

<template>
  <div ref="mountPoint" class="guestbook-shell"></div>
</template>

<style scoped>
.guestbook-shell {
  width: 100%;
  min-height: 100vh;
}
</style>
