<template>
  <div class="guestbook-list-page min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto">
      <!-- 헤더 -->
      <header class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          방명록
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          당신의 방문 흔적을 남겨주세요
        </p>
      </header>

      <!-- 방명록 작성 폼 -->
      <section class="mb-12">
        <GuestbookForm @submit-success="handleSubmitSuccess" />
      </section>

      <!-- 방명록 목록 -->
      <section>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          방명록 목록
          <span v-if="total > 0" class="text-lg font-normal text-gray-500 dark:text-gray-400">
            ({{ total }}개)
          </span>
        </h2>

        <!-- 로딩 상태 (초기 로드) -->
        <div
          v-if="loading && entries.length === 0"
          class="flex justify-center items-center py-20"
        >
          <div class="flex flex-col items-center gap-3">
            <div
              class="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 dark:border-gray-600 border-t-indigo-600"
              role="status"
              aria-label="로딩 중"
            ></div>
            <p class="text-gray-500 dark:text-gray-400">
              방명록을 불러오는 중...
            </p>
          </div>
        </div>

        <!-- 에러 상태 -->
        <div
          v-else-if="error && entries.length === 0"
          class="text-center py-20"
        >
          <div class="p-6 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-lg inline-block">
            <p class="font-medium mb-2">{{ error }}</p>
            <button
              @click="handleRetry"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
            >
              다시 시도
            </button>
          </div>
        </div>

        <!-- 빈 상태 -->
        <div
          v-else-if="entries.length === 0"
          class="text-center py-20"
        >
          <div class="text-gray-400 dark:text-gray-600 mb-4">
            <svg
              class="w-24 h-24 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              ></path>
            </svg>
          </div>
          <p class="text-xl text-gray-500 dark:text-gray-400">
            아직 작성된 방명록이 없습니다.
          </p>
          <p class="text-sm text-gray-400 dark:text-gray-600 mt-2">
            첫 번째 방명록을 남겨주세요!
          </p>
        </div>

        <!-- 방명록 그리드 -->
        <InfiniteScroll
          v-else
          :has-more="hasMore"
          :loading="loading"
          :error="error"
          loading-text="더 불러오는 중..."
          end-text="모든 방명록을 불러왔습니다."
          :on-load-more="handleLoadMore"
          @retry="handleRetry"
        >
          <div
            class="flex flex-col gap-4 mb-8"
          >
            <GuestbookCard
              v-for="entry in entries"
              :key="entry.id"
              :entry="entry"
            />
          </div>
        </InfiniteScroll>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import GuestbookForm from '../components/GuestbookForm.vue';
import GuestbookCard from '../components/GuestbookCard.vue';
import InfiniteScroll from '../components/InfiniteScroll.vue';
import { useGuestbook } from '../composables/useGuestbook';

// Composable
const {
  entries,
  loading,
  error,
  hasMore,
  total,
  fetchEntries,
  loadMore,
  reset,
} = useGuestbook();

// 초기 로드
onMounted(async () => {
  await fetchEntries(0, 30);
});

// 더 불러오기
async function handleLoadMore() {
  await loadMore(30);
}

// 재시도
async function handleRetry() {
  reset();
  await fetchEntries(0, 30);
}

// 작성 성공 시 목록 새로고침
async function handleSubmitSuccess() {
  // 작성 후에는 pending 상태라 목록에 바로 나타나지 않음
  // 사용자에게 승인 대기 중임을 알림 (GuestbookForm에서 처리)
}
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
