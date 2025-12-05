<script setup lang="ts">
interface Props {
  html: string;
}

defineProps<Props>();
</script>

<template>
  <article
    class="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-4xl prose-h1:mb-4 prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:!p-0 prose-pre:!my-2 prose-pre:bg-transparent dark:prose-pre:bg-transparent prose-blockquote:border-l-blue-600 dark:prose-blockquote:border-l-blue-400 prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-800 prose-blockquote:py-2 prose-blockquote:px-4 prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6 prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-table:border-collapse prose-th:bg-gray-100 dark:prose-th:bg-gray-800 prose-th:border dark:prose-th:border-gray-700 prose-td:border dark:prose-td:border-gray-700 prose-img:rounded-lg prose-img:shadow-md"
    v-html="html"
  />
</template>

<style>
/* prose 너비 제한 완전히 제거 */
article.prose {
  max-width: none !important;
}

/* Prism 코드 하이라이팅 커스텀 스타일 */
article pre[class*='language-'] {
  @apply rounded-lg overflow-x-auto;
  margin: 0.5rem 0 !important;
  padding: 1rem !important;
}

article code[class*='language-'] {
  font-size: 0.875rem !important;
  line-height: 1.7 !important;
}

/* 인라인 코드 스타일 유지 */
article :not(pre) > code {
  @apply text-pink-600 dark:text-pink-400 bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded;
}

/* 이미지 lazy loading */
article img {
  @apply w-full h-auto;
  loading: lazy;
}

/* 테이블 반응형 */
article table {
  @apply block overflow-x-auto whitespace-nowrap;
}

@media (max-width: 768px) {
  article table {
    @apply text-sm;
  }
}
</style>
