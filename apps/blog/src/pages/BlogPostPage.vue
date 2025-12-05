<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { format } from 'date-fns';
import { useBlogPosts } from '../composables/useBlogPosts';
import { useBlogPostMeta } from '../utils/seo';
import MarkdownRenderer from '../components/MarkdownRenderer.vue';
import BlogTOC from '../components/BlogTOC.vue';

interface Props {
  slug: string;
}

const props = defineProps<Props>();
const router = useRouter();

const { findBySlug, getRelatedPosts } = useBlogPosts();

// 현재 포스트 찾기
const currentPost = computed(() => findBySlug(props.slug));

// 404 처리
if (!currentPost.value) {
  router.push('/blog');
}

// SEO 메타 태그 적용 (currentPost가 변경될 때마다)
watch(
  currentPost,
  post => {
    if (post) {
      useBlogPostMeta({
        title: post.frontmatter.title,
        description: post.frontmatter.description,
        slug: post.slug,
        thumbnail: post.frontmatter.thumbnail,
        author: post.frontmatter.author,
        date: post.frontmatter.date,
        tags: post.frontmatter.tags,
      });
    }
  },
  { immediate: true }
);

// 날짜 포맷팅
const formattedDate = computed(() => {
  if (!currentPost.value) return '';
  return format(new Date(currentPost.value.frontmatter.date), 'MMMM dd, yyyy');
});

// 읽기 시간
const readingTimeText = computed(() => {
  if (!currentPost.value) return '';
  return `${currentPost.value.readingTime} min read`;
});

// 관련 포스트
const relatedPosts = computed(() => {
  if (!currentPost.value) return [];
  return getRelatedPosts(currentPost.value, 3);
});

/**
 * blog.jeongwoo.in/* 으로 진입한 경우, jeongwoo.in/blog로 리다이렉트
 * 이 외의 경우는 '/'로 라우팅.
 */
const blogHomeUrl = (event: Event) => {
  if (window.location.hostname === 'blog.jeongwoo.in') {
    event.preventDefault();
    router.replace('https://jeongwoo.in/blog');
  }
};
</script>

<template>
  <div
    v-if="currentPost"
    class="blog-post-page min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4"
  >
    <div class="max-w-7xl mx-auto">
      <!-- 뒤로 가기 -->
      <div class="mb-8">
        <a
          href="/"
          @click="blogHomeUrl"
          class="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
        >
          <svg
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Blog
        </a>
      </div>

      <!-- 2열 레이아웃 (Desktop) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- 메인 콘텐츠 (왼쪽, 9/12) - Shell 레이아웃을 고려하여 더 넓게 -->
        <div class="lg:col-span-12">
          <!-- 헤더 -->
          <header class="mb-8">
            <h1
              class="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white"
            >
              {{ currentPost.frontmatter.title }}
            </h1>

            <!-- 메타 정보 -->
            <div
              class="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 mb-6"
            >
              <time :datetime="currentPost.frontmatter.date">
                {{ formattedDate }}
              </time>
              <span>•</span>
              <span>{{ readingTimeText }}</span>
              <span v-if="currentPost.frontmatter.author">•</span>
              <span v-if="currentPost.frontmatter.author">
                {{ currentPost.frontmatter.author }}
              </span>
            </div>

            <!-- 태그 -->
            <div class="flex flex-wrap gap-2">
              <router-link
                v-for="tag in currentPost.frontmatter.tags"
                :key="tag"
                :to="`/blog/tag/${tag}`"
                class="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                #{{ tag }}
              </router-link>
            </div>
          </header>

          <!-- 구분선 -->
          <hr class="border-gray-300 dark:border-gray-700 mb-8" />

          <!-- 마크다운 콘텐츠 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <MarkdownRenderer :html="currentPost.html" />
          </div>

          <!-- 관련 포스트 -->
          <div v-if="relatedPosts.length > 0" class="mt-12">
            <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              Related Posts
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <router-link
                v-for="post in relatedPosts"
                :key="post.slug"
                :to="`/blog/${post.slug}`"
                class="block bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
              >
                <h3
                  class="text-xl font-semibold mb-2 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {{ post.frontmatter.title }}
                </h3>
                <p
                  class="text-gray-600 dark:text-gray-400 text-sm line-clamp-2"
                >
                  {{ post.frontmatter.description }}
                </p>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 404 처리 (currentPost가 없을 경우) -->
  <div v-else class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
        Post Not Found
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">
        The blog post you're looking for doesn't exist.
      </p>

      <a
        href="/"
        @click="blogHomeUrl"
        class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Back to Blog
      </a>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
