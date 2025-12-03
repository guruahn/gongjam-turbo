<template>
  <div>
    <!-- 로딩 상태 -->
    <div v-if="loading && entries.length === 0" class="text-center py-12">
      <div
        class="inline-block animate-spin rounded-full h-10 w-10 border-2 border-gray-300 dark:border-gray-600 border-t-blue-600"
      ></div>
      <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">로딩 중...</p>
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="error" class="text-center py-12">
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">{{ error }}</p>
      <button
        @click="$emit('retry')"
        class="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        다시 시도
      </button>
    </div>

    <!-- 빈 상태 -->
    <div v-else-if="entries.length === 0" class="text-center py-12">
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
      <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">
        {{ emptyMessage }}
      </p>
    </div>

    <!-- 엔트리 목록 - 테이블 스타일 -->
    <div v-else class="overflow-hidden">
      <div class="divide-y divide-gray-200 dark:divide-gray-700">
        <div
          v-for="entry in entries"
          :key="entry.id"
          class="py-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
        >
          <div class="flex items-start gap-4">
            <!-- 프로필 이미지 -->
            <img
              :src="entry.profile_image"
              :alt="entry.profile_image"
              class="w-10 h-10 rounded-full flex-shrink-0 ring-2 ring-gray-100 dark:ring-gray-700"
              loading="lazy"
            />

            <!-- 내용 -->
            <div class="flex-1 min-w-0">
              <!-- 닉네임과 작성 시간 -->
              <div class="flex items-center gap-2 mb-1">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ entry.nickname }}
                </h3>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatDate(entry.created_at) }}
                </span>
              </div>

              <!-- 메시지 -->
              <p
                class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words"
              >
                {{ entry.message }}
              </p>
            </div>

            <!-- 액션 버튼 -->
            <div
              v-if="showApproveButton || showRejectButton"
              class="flex items-center gap-2 flex-shrink-0"
            >
              <!-- 승인 버튼 -->
              <button
                v-if="showApproveButton"
                @click="handleApprove(entry.id)"
                :disabled="actionLoading === entry.id"
                class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                title="승인"
              >
                <svg
                  v-if="actionLoading !== entry.id"
                  class="w-4 h-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <svg
                  v-else
                  class="animate-spin w-4 h-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {{ actionLoading === entry.id ? '처리 중' : '승인' }}
              </button>

              <!-- 거부 버튼 -->
              <button
                v-if="showRejectButton"
                @click="handleReject(entry.id)"
                :disabled="actionLoading === entry.id"
                class="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                title="거부"
              >
                <svg
                  v-if="actionLoading !== entry.id"
                  class="w-4 h-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <svg
                  v-else
                  class="animate-spin w-4 h-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {{ actionLoading === entry.id ? '처리 중' : '거부' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { GuestbookEntry } from '../types/guestbook';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Props {
  entries: GuestbookEntry[];
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  showApproveButton?: boolean;
  showRejectButton?: boolean;
}

withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
  emptyMessage: '표시할 항목이 없습니다.',
  showApproveButton: true,
  showRejectButton: true,
});

const emit = defineEmits<{
  approve: [entryId: string];
  reject: [entryId: string];
  retry: [];
}>();

const actionLoading = ref<string | null>(null);

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'yyyy-MM-dd HH:mm', { locale: ko });
}

async function handleApprove(entryId: string) {
  actionLoading.value = entryId;
  try {
    emit('approve', entryId);
  } finally {
    // 부모 컴포넌트에서 처리 완료 후 actionLoading을 null로 설정
    setTimeout(() => {
      if (actionLoading.value === entryId) {
        actionLoading.value = null;
      }
    }, 500);
  }
}

async function handleReject(entryId: string) {
  actionLoading.value = entryId;
  try {
    emit('reject', entryId);
  } finally {
    // 부모 컴포넌트에서 처리 완료 후 actionLoading을 null로 설정
    setTimeout(() => {
      if (actionLoading.value === entryId) {
        actionLoading.value = null;
      }
    }, 500);
  }
}
</script>
