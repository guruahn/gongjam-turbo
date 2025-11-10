<script setup lang="ts">
import { computed } from 'vue';
import { format } from 'date-fns';
import type { BlogPost } from '../types/blog';

interface Props {
  post: BlogPost;
}

const props = defineProps<Props>();

// 날짜 포맷팅
const formattedDate = computed(() => {
  return format(new Date(props.post.frontmatter.date), 'MMM dd, yyyy');
});

// 읽기 시간 텍스트
const readingTimeText = computed(() => {
  return `${props.post.readingTime} min read`;
});
</script>

<template>
  <router-link
    :to="`/blog/${post.slug}`"
    class="blog-card group block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
  >
    <!-- 썸네일 (있을 경우) -->
    <div
      v-if="post.frontmatter.thumbnail"
      class="aspect-video bg-gray-200 dark:bg-gray-700 overflow-hidden"
    >
      <img
        :src="post.frontmatter.thumbnail"
        :alt="post.frontmatter.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>

    <!-- 카드 컨텐츠 -->
    <div class="p-6">
      <!-- 제목 -->
      <h2
        class="text-2xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
      >
        {{ post.frontmatter.title }}
      </h2>

      <!-- 메타 정보 (날짜, 읽기 시간) -->
      <div class="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
        <time :datetime="post.frontmatter.date">
          {{ formattedDate }}
        </time>
        <span>•</span>
        <span>{{ readingTimeText }}</span>
      </div>

      <!-- 설명 -->
      <p class="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
        {{ post.frontmatter.description }}
      </p>

      <!-- 태그 -->
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in post.frontmatter.tags"
          :key="tag"
          class="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full"
        >
          #{{ tag }}
        </span>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
