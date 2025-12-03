<template>
  <div class="infinite-scroll">
    <!-- 기본 슬롯: 목록 아이템 -->
    <slot />

    <!-- 로딩 인디케이터 (관찰 대상) -->
    <div
      ref="target"
      class="loading-trigger py-8 flex justify-center items-center"
    >
      <div v-if="isLoading" class="flex flex-col items-center gap-3">
        <div
          class="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 dark:border-gray-600 border-t-indigo-600"
          role="status"
          aria-label="로딩 중"
        ></div>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ loadingText }}
        </p>
      </div>
      <p
        v-else-if="!hasMore"
        class="text-sm text-gray-500 dark:text-gray-400"
      >
        {{ endText }}
      </p>
    </div>

    <!-- 에러 메시지 -->
    <div
      v-if="error"
      class="error-message p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-lg text-center"
    >
      <p class="font-medium mb-2">{{ error }}</p>
      <button
        @click="handleRetry"
        class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
      >
        다시 시도
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useInfiniteScroll } from '../composables/useInfiniteScroll';

interface Props {
  hasMore: boolean;
  loading?: boolean;
  error?: string | null;
  loadingText?: string;
  endText?: string;
  onLoadMore: () => Promise<void> | void;
}

interface Emits {
  (e: 'retry'): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
  loadingText: '더 불러오는 중...',
  endText: '모든 방명록을 불러왔습니다.',
});

const emit = defineEmits<Emits>();

// Infinite scroll composable 사용
const { isLoading, target } = useInfiniteScroll({
  threshold: 100,
  onLoadMore: props.onLoadMore,
  disabled: () => !props.hasMore || props.loading || !!props.error,
});

// 로딩 상태 동기화
watch(
  () => props.loading,
  (newLoading) => {
    isLoading.value = newLoading;
  }
);

// 재시도
function handleRetry() {
  emit('retry');
  props.onLoadMore();
}
</script>

<style scoped>
.loading-trigger {
  min-height: 100px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
