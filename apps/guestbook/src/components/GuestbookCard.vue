<template>
  <article
    class="guestbook-card bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200"
  >
    <!-- 상단: 프로필 + 닉네임 -->
    <div class="flex items-center gap-3 mb-3">
      <img
        :src="profileImageUrl"
        :alt="`${entry.nickname} 프로필`"
        class="w-12 h-12 rounded-full object-cover"
        loading="lazy"
      />
      <div class="flex-1 min-w-0">
        <h3
          class="text-base font-bold text-gray-900 dark:text-white truncate"
        >
          {{ entry.nickname }}
        </h3>
        <time
          :datetime="entry.created_at"
          class="text-xs text-gray-500 dark:text-gray-400"
        >
          {{ formattedDate }}
        </time>
      </div>
    </div>

    <!-- 메시지 -->
    <p
      class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words line-clamp-3"
    >
      {{ entry.message }}
    </p>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { GuestbookEntry } from '../types/guestbook';
import { format, formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Props {
  entry: GuestbookEntry;
}

const props = defineProps<Props>();

// 프로필 이미지 URL (이미 URL이 저장되어 있음)
const profileImageUrl = computed(() => {
  return props.entry.profile_image;
});

// 날짜 포맷팅
const formattedDate = computed(() => {
  const date = new Date(props.entry.created_at);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  // 24시간 이내면 상대 시간 표시
  if (diffInHours < 24) {
    return formatDistanceToNow(date, { addSuffix: true, locale: ko });
  }

  // 그 외에는 절대 시간 표시
  return format(date, 'yyyy.MM.dd HH:mm', { locale: ko });
});
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
