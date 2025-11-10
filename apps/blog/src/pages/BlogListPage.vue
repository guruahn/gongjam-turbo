<script setup lang="ts">
import { computed } from 'vue';
import { useBlogPosts } from '../composables/useBlogPosts';
import { useBlogListMeta } from '../utils/seo';
import BlogCard from '../components/BlogCard.vue';
import TagFilter from '../components/TagFilter.vue';

interface Props {
  tag?: string;
}

const props = defineProps<Props>();

const { posts, tags, filterByTag } = useBlogPosts();

// SEO 메타 태그 적용
useBlogListMeta();

// 필터링된 포스트 목록
const filteredPosts = computed(() => {
  if (props.tag) {
    return filterByTag(props.tag);
  }
  return posts.value;
});

// 포스트 개수
const postCount = computed(() => filteredPosts.value.length);
</script>

<template>
  <div class="blog-list-page min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- 헤더 -->
      <header class="mb-12">
        <h1 class="text-5xl font-bold mb-4 text-gray-900 dark:text-white">
          Blog
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-400">
          Thoughts on development, design, and technology
        </p>
      </header>

      <!-- 태그 필터 -->
      <div class="mb-12">
        <TagFilter :tags="tags" :selected-tag="tag" />
      </div>

      <!-- 포스트 개수 -->
      <div class="mb-6">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          <span v-if="tag" class="font-medium">
            {{ postCount }} post{{ postCount !== 1 ? 's' : '' }} tagged with #{{ tag }}
          </span>
          <span v-else class="font-medium">
            {{ postCount }} post{{ postCount !== 1 ? 's' : '' }} total
          </span>
        </p>
      </div>

      <!-- 포스트 그리드 -->
      <div
        v-if="filteredPosts.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <BlogCard
          v-for="post in filteredPosts"
          :key="post.slug"
          :post="post"
        />
      </div>

      <!-- 포스트 없음 -->
      <div v-else class="text-center py-20">
        <p class="text-2xl text-gray-400 dark:text-gray-600">
          No posts found with tag #{{ tag }}
        </p>
        <router-link
          to="/blog"
          class="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          View All Posts
        </router-link>
      </div>
    </div>
  </div>
</template>
