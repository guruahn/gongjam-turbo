import { ref, onMounted, onUnmounted } from 'vue';

export interface InfiniteScrollOptions {
  threshold?: number; // 하단에서 몇 px 떨어진 곳에서 트리거할지 (기본값: 100px)
  onLoadMore: () => Promise<void> | void; // 추가 로드 콜백
  disabled?: () => boolean; // 비활성화 조건
}

export function useInfiniteScroll(options: InfiniteScrollOptions) {
  const {
    threshold = 100,
    onLoadMore,
    disabled = () => false,
  } = options;

  const isLoading = ref(false);
  const observer = ref<IntersectionObserver | null>(null);
  const target = ref<HTMLElement | null>(null);

  // Intersection Observer 방식
  function setupIntersectionObserver() {
    observer.value = new IntersectionObserver(
      async (entries) => {
        const entry = entries[0];

        // 화면에 보이고, 로딩 중이 아니고, 비활성화되지 않았을 때
        if (entry && entry.isIntersecting && !isLoading.value && !disabled()) {
          isLoading.value = true;
          try {
            await onLoadMore();
          } catch (error) {
            console.error('Failed to load more:', error);
          } finally {
            isLoading.value = false;
          }
        }
      },
      {
        root: null, // viewport 기준
        rootMargin: `${threshold}px`,
        threshold: 0.1,
      }
    );

    if (target.value) {
      observer.value.observe(target.value);
    }
  }

  // Scroll 이벤트 방식 (폴백)
  function setupScrollListener() {
    const handleScroll = async () => {
      if (isLoading.value || disabled()) {
        return;
      }

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      // 하단에서 threshold px 떨어진 곳에 도달하면 트리거
      if (scrollTop + clientHeight >= scrollHeight - threshold) {
        isLoading.value = true;
        try {
          await onLoadMore();
        } catch (error) {
          console.error('Failed to load more:', error);
        } finally {
          isLoading.value = false;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }

  // 초기화
  onMounted(() => {
    // Intersection Observer를 우선 사용, 지원하지 않으면 스크롤 이벤트 사용
    if ('IntersectionObserver' in window) {
      setupIntersectionObserver();
    } else {
      const cleanup = setupScrollListener();
      onUnmounted(cleanup);
    }
  });

  // 정리
  onUnmounted(() => {
    if (observer.value) {
      observer.value.disconnect();
      observer.value = null;
    }
  });

  return {
    isLoading,
    target, // 이 ref를 관찰할 요소에 연결
  };
}
