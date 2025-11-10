<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import type { TableOfContentsItem } from '../types/blog';

interface Props {
  toc: TableOfContentsItem[];
}

const props = defineProps<Props>();

// 현재 활성화된 섹션 ID
const activeId = ref<string>('');

// Intersection Observer로 현재 보이는 섹션 추적
let observer: IntersectionObserver | null = null;

onMounted(() => {
  // 모든 헤딩 요소에 대해 Intersection Observer 설정
  const headings = props.toc.map((item) => document.getElementById(item.id)).filter(Boolean);

  if (headings.length === 0) return;

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id;
        }
      });
    },
    {
      rootMargin: '-80px 0px -80% 0px', // 상단 80px 아래 영역이 보일 때 활성화
      threshold: 0,
    }
  );

  headings.forEach((heading) => {
    if (heading) observer!.observe(heading);
  });
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});

// 클릭 시 해당 섹션으로 스크롤
function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (element) {
    const yOffset = -80; // 헤더 높이만큼 오프셋
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}
</script>

<template>
  <nav v-if="toc.length > 0" class="blog-toc sticky top-24">
    <h3 class="text-lg font-bold mb-4 text-gray-900 dark:text-white">
      Table of Contents
    </h3>
    <ul class="space-y-2">
      <li
        v-for="item in toc"
        :key="item.id"
        :class="[
          'text-sm transition-colors duration-200',
          item.level === 2 ? 'ml-0' : 'ml-4',
        ]"
      >
        <a
          :href="`#${item.id}`"
          :class="[
            'block py-1 border-l-2 pl-3 hover:border-blue-600 dark:hover:border-blue-400',
            activeId === item.id
              ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-medium'
              : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400',
          ]"
          @click.prevent="scrollToSection(item.id)"
        >
          {{ item.text }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.blog-toc {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

/* 스크롤바 스타일 */
.blog-toc::-webkit-scrollbar {
  width: 4px;
}

.blog-toc::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800;
}

.blog-toc::-webkit-scrollbar-thumb {
  @apply bg-gray-400 dark:bg-gray-600 rounded;
}

.blog-toc::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-500 dark:bg-gray-500;
}
</style>
