import { ref, computed } from 'vue';
import type {
  GuestbookEntry,
  GuestbookFormData,
  GuestbookStatus,
} from '../types/guestbook';
import {
  fetchGuestbookEntries,
  createGuestbookEntry,
  fetchAllEntries,
  updateEntryStatus,
  fetchGuestbookStats,
} from '../utils/supabase';

export function useGuestbook() {
  const entries = ref<GuestbookEntry[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const currentPage = ref(0);
  const hasMore = ref(true);
  const total = ref(0);

  // 방명록 엔트리 가져오기 (공개된 것만)
  async function fetchEntries(page: number = 0, limit: number = 30) {
    loading.value = true;
    error.value = null;

    try {
      const result = await fetchGuestbookEntries(page, limit);

      if (page === 0) {
        // 첫 페이지면 초기화
        entries.value = result.entries;
      } else {
        // 추가 페이지면 append
        entries.value = [...entries.value, ...result.entries];
      }

      total.value = result.total;
      hasMore.value = result.hasMore;
      currentPage.value = page;

      return result;
    } catch (e) {
      error.value = e instanceof Error ? e.message : '방명록을 불러오는데 실패했습니다.';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  // 다음 페이지 로드
  async function loadMore(limit: number = 30) {
    if (!hasMore.value || loading.value) {
      return;
    }

    await fetchEntries(currentPage.value + 1, limit);
  }

  // 방명록 작성
  async function createEntry(formData: GuestbookFormData) {
    loading.value = true;
    error.value = null;

    try {
      const newEntry = await createGuestbookEntry(formData);
      return newEntry;
    } catch (e) {
      error.value = e instanceof Error ? e.message : '방명록 작성에 실패했습니다.';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  // 초기화
  function reset() {
    entries.value = [];
    currentPage.value = 0;
    hasMore.value = true;
    total.value = 0;
    loading.value = false;
    error.value = null;
  }

  return {
    entries,
    loading,
    error,
    currentPage,
    hasMore,
    total,
    fetchEntries,
    loadMore,
    createEntry,
    reset,
  };
}

// 관리자용 composable
export function useGuestbookAdmin() {
  const entries = ref<GuestbookEntry[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const stats = ref({
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  // 모든 엔트리 가져오기 (관리자만)
  async function fetchAll(status?: GuestbookStatus) {
    loading.value = true;
    error.value = null;

    try {
      const result = await fetchAllEntries(status);
      entries.value = result;
      return result;
    } catch (e) {
      error.value = e instanceof Error ? e.message : '방명록을 불러오는데 실패했습니다.';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  // 통계 가져오기
  async function fetchStats() {
    try {
      const result = await fetchGuestbookStats();
      stats.value = result;
      return result;
    } catch (e) {
      error.value = e instanceof Error ? e.message : '통계를 불러오는데 실패했습니다.';
      throw e;
    }
  }

  // 엔트리 승인/거부
  async function updateStatus(entryId: string, action: 'approve' | 'reject') {
    loading.value = true;
    error.value = null;

    try {
      const updatedEntry = await updateEntryStatus(entryId, action);

      // 낙관적 업데이트: 로컬 목록에서 제거
      entries.value = entries.value.filter(entry => entry.id !== entryId);

      // 통계 업데이트
      await fetchStats();

      return updatedEntry;
    } catch (e) {
      error.value = e instanceof Error ? e.message : '상태 변경에 실패했습니다.';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  // pending 엔트리만 필터링
  const pendingEntries = computed(() =>
    entries.value.filter(entry => entry.status === 'pending')
  );

  // approved 엔트리만 필터링
  const approvedEntries = computed(() =>
    entries.value.filter(entry => entry.status === 'approved')
  );

  // rejected 엔트리만 필터링
  const rejectedEntries = computed(() =>
    entries.value.filter(entry => entry.status === 'rejected')
  );

  return {
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
  };
}
