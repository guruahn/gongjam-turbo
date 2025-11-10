<script setup lang="ts">
interface Props {
  html: string;
}

defineProps<Props>();
</script>

<template>
  <article
    class="prose prose-lg dark:prose-invert max-w-none
           prose-headings:font-bold
           prose-h1:text-4xl prose-h1:mb-4
           prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4
           prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3
           prose-p:text-gray-700 dark:prose-p:text-gray-300
           prose-p:leading-relaxed prose-p:mb-4
           prose-a:text-blue-600 dark:prose-a:text-blue-400
           prose-a:no-underline hover:prose-a:underline
           prose-strong:text-gray-900 dark:prose-strong:text-gray-100
           prose-code:text-pink-600 dark:prose-code:text-pink-400
           prose-code:bg-gray-100 dark:prose-code:bg-gray-800
           prose-code:px-1 prose-code:py-0.5 prose-code:rounded
           prose-code:before:content-none prose-code:after:content-none
           prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950
           prose-pre:text-gray-100
           prose-blockquote:border-l-blue-600 dark:prose-blockquote:border-l-blue-400
           prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-800
           prose-blockquote:py-2 prose-blockquote:px-4
           prose-ul:list-disc prose-ul:pl-6
           prose-ol:list-decimal prose-ol:pl-6
           prose-li:text-gray-700 dark:prose-li:text-gray-300
           prose-table:border-collapse
           prose-th:bg-gray-100 dark:prose-th:bg-gray-800
           prose-th:border dark:prose-th:border-gray-700
           prose-td:border dark:prose-td:border-gray-700
           prose-img:rounded-lg prose-img:shadow-md"
    v-html="html"
  />
</template>

<style>
/* Shiki 코드 하이라이팅 스타일 */
.shiki-container {
  @apply my-6 rounded-lg overflow-hidden;
}

.shiki-light,
.shiki-dark {
  @apply overflow-x-auto;
}

.shiki-light pre,
.shiki-dark pre {
  @apply p-4 bg-transparent;
  margin: 0 !important;
}

/* 다크모드에서 라이트 테마 숨기기 */
.dark .shiki-light {
  @apply hidden;
}

.dark .shiki-dark {
  @apply block;
}

/* 라이트모드에서 다크 테마 숨기기 */
html:not(.dark) .shiki-light {
  @apply block;
}

html:not(.dark) .shiki-dark {
  @apply hidden;
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
