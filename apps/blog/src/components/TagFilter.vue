<script setup lang="ts">
interface Props {
  tags: string[];
  selectedTag?: string;
}

const props = defineProps<Props>();

const isTagSelected = (tag: string) => {
  return props.selectedTag === tag;
};
</script>

<template>
  <div class="tag-filter">
    <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
      Filter by Tag
    </h3>

    <div class="flex flex-wrap gap-2">
      <!-- All 태그 (선택 해제) -->
      <router-link
        to="/blog"
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
          !selectedTag
            ? 'bg-blue-600 text-white dark:bg-blue-500'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600',
        ]"
      >
        All
      </router-link>

      <!-- 태그 목록 -->
      <router-link
        v-for="tag in tags"
        :key="tag"
        :to="`/blog/tag/${tag}`"
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
          isTagSelected(tag)
            ? 'bg-blue-600 text-white dark:bg-blue-500'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600',
        ]"
      >
        #{{ tag }}
      </router-link>
    </div>
  </div>
</template>
