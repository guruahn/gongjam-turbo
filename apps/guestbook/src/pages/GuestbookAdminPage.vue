<template>
  <div class="guestbook-admin-page min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
      <!-- 헤더 -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-3xl font-semibold text-gray-900 dark:text-white">
              방명록 관리
            </h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              방문자들이 남긴 메시지를 승인하거나 거부할 수 있습니다.
            </p>
          </div>

          <!-- 로그아웃 버튼 -->
          <button
            @click="handleSignOut"
            class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600
                   rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300
                   bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700
                   transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            로그아웃
          </button>
        </div>
      </div>

      <!-- 대시보드 통계 -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <!-- 승인 대기 -->
        <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">승인 대기</p>
            <p class="text-3xl font-semibold text-gray-900 dark:text-white mt-1">
              {{ stats.pending }}
            </p>
          </div>
        </div>

        <!-- 승인 완료 -->
        <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">승인 완료</p>
            <p class="text-3xl font-semibold text-gray-900 dark:text-white mt-1">
              {{ stats.approved }}
            </p>
          </div>
        </div>

        <!-- 거부됨 -->
        <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">거부됨</p>
            <p class="text-3xl font-semibold text-gray-900 dark:text-white mt-1">
              {{ stats.rejected }}
            </p>
          </div>
        </div>
      </div>

      <!-- 메인 콘텐츠 카드 -->
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
        <!-- 필터 탭 -->
        <div class="border-b border-gray-200 dark:border-gray-700 px-6">
          <nav class="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab.value"
              @click="currentTab = tab.value"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors',
                currentTab === tab.value
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              ]"
            >
              {{ tab.label }}
              <span
                v-if="tab.count !== undefined"
                :class="[
                  'ml-2 py-0.5 px-2 rounded-full text-xs font-medium',
                  currentTab === tab.value
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                ]"
              >
                {{ tab.count }}
              </span>
            </button>
          </nav>
        </div>

        <!-- 알림 메시지 -->
        <div v-if="successMessage || errorMessage" class="px-6 pt-6">
          <div
            v-if="successMessage"
            class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start"
          >
            <svg class="w-5 h-5 text-green-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <p class="text-sm text-green-800 dark:text-green-200">{{ successMessage }}</p>
          </div>

          <div
            v-if="errorMessage"
            class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start"
          >
            <svg class="w-5 h-5 text-red-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <p class="text-sm text-red-800 dark:text-red-200">{{ errorMessage }}</p>
          </div>
        </div>

        <!-- 엔트리 목록 -->
        <div class="p-6">
          <AdminPanel
            :entries="currentEntries"
            :loading="loading"
            :error="error"
            :empty-message="getEmptyMessage()"
            :show-approve-button="currentTab === 'pending'"
            :show-reject-button="currentTab === 'pending'"
            @approve="handleApprove"
            @reject="handleReject"
            @retry="loadEntries"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useGuestbookAdmin } from '../composables/useGuestbook';
import { useAuth } from '../composables/useAuth';
import AdminPanel from '../components/AdminPanel.vue';
import type { GuestbookStatus } from '../types/guestbook';

const router = useRouter();
const {
  entries,
  loading,
  error,
  stats,
  pendingEntries,
  approvedEntries,
  rejectedEntries,
  fetchAll,
  fetchStats,
  updateStatus,
} = useGuestbookAdmin();

const { signOut } = useAuth();

// 현재 탭
const currentTab = ref<GuestbookStatus | 'all'>('pending');

// 탭 목록
const tabs = computed(() => [
  { label: '승인 대기', value: 'pending' as const, count: stats.value.pending },
  { label: '승인 완료', value: 'approved' as const, count: stats.value.approved },
  { label: '거부됨', value: 'rejected' as const, count: stats.value.rejected },
  { label: '전체', value: 'all' as const },
]);

// 현재 탭에 따른 엔트리
const currentEntries = computed(() => {
  switch (currentTab.value) {
    case 'pending':
      return pendingEntries.value;
    case 'approved':
      return approvedEntries.value;
    case 'rejected':
      return rejectedEntries.value;
    case 'all':
      return entries.value;
    default:
      return entries.value;
  }
});

// 알림 메시지
const successMessage = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

// 빈 상태 메시지
function getEmptyMessage(): string {
  switch (currentTab.value) {
    case 'pending':
      return '승인 대기 중인 항목이 없습니다.';
    case 'approved':
      return '승인 완료된 항목이 없습니다.';
    case 'rejected':
      return '거부된 항목이 없습니다.';
    case 'all':
      return '항목이 없습니다.';
    default:
      return '항목이 없습니다.';
  }
}

// 엔트리 로드
async function loadEntries() {
  try {
    await fetchAll();
    await fetchStats();
  } catch (e) {
    console.error('Failed to load entries:', e);
  }
}

// 승인 처리
async function handleApprove(entryId: string) {
  clearMessages();

  try {
    await updateStatus(entryId, 'approve');
    successMessage.value = '방명록이 승인되었습니다.';

    // 3초 후 메시지 자동 제거
    setTimeout(() => {
      successMessage.value = null;
    }, 3000);
  } catch (e) {
    errorMessage.value = '승인 처리에 실패했습니다.';
    console.error('Failed to approve entry:', e);

    // 3초 후 메시지 자동 제거
    setTimeout(() => {
      errorMessage.value = null;
    }, 3000);
  }
}

// 거부 처리
async function handleReject(entryId: string) {
  clearMessages();

  try {
    await updateStatus(entryId, 'reject');
    successMessage.value = '방명록이 거부되었습니다.';

    // 3초 후 메시지 자동 제거
    setTimeout(() => {
      successMessage.value = null;
    }, 3000);
  } catch (e) {
    errorMessage.value = '거부 처리에 실패했습니다.';
    console.error('Failed to reject entry:', e);

    // 3초 후 메시지 자동 제거
    setTimeout(() => {
      errorMessage.value = null;
    }, 3000);
  }
}

// 로그아웃 처리
async function handleSignOut() {
  try {
    await signOut();
    router.push('/');
  } catch (e) {
    console.error('Failed to sign out:', e);
  }
}

// 메시지 초기화
function clearMessages() {
  successMessage.value = null;
  errorMessage.value = null;
}

// 초기 로드
onMounted(() => {
  loadEntries();
});
</script>
