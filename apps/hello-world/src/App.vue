<script setup lang="ts">
import { portfolio } from './data/portfolio';
</script>

<template>
  <div class="hello-content space-y-8">
    <!-- Greeting Section -->
    <section class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
      <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        👋 안녕하세요!
      </h2>
      <div class="prose prose-lg dark:prose-invert max-w-none">
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          우연한 기회로 IT 업계에 발을 들였고 💻<br />
          웹 기술로 세상을 바꿀 수 있다는 젊은 호기심 하나로 개발을
          시작했습니다.<br />
          지금도 금융과 보험의 변화를 꿈꾸는 회사에서 세상을 바꾸는 일을 도모
          하고 있습니다.
        </p>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          아직은 스페셜리스트라 부르기엔 부족하지만, 꾸준히 나아가고 있습니다.
          🌱<br />
          존경받는 시니어가 되는 길은 멀지만, 맡은 일엔 책임을 다하려고 합니다.
        </p>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
          자연을 좋아하는 캠퍼이지만 도시생활은 포기 못합니다. 🏕️<br />
          가끔은 허세 섞인 독서로 마음의 균형을 잡습니다. 📚
        </p>
      </div>
    </section>

    <!-- Portfolio Timeline Section -->
    <section class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        💼 Experience & Portfolio
      </h2>
      <div class="space-y-8">
        <div
          v-for="item in portfolio"
          :key="item.id"
          class="relative pl-8 pb-8 border-l-2 border-blue-500 dark:border-blue-400 last:pb-0"
        >
          <!-- Timeline Icon -->
          <div
            class="absolute left-[-17px] top-0 w-8 h-8 bg-blue-500 dark:bg-blue-400 rounded-full flex items-center justify-center text-white"
          >
            <span class="text-sm">{{ item.icon }}</span>
          </div>

          <!-- Content -->
          <div>
            <!-- Title -->
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">
              <a
                v-if="item.link"
                :href="item.link"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {{ item.title }}
              </a>
              <span v-else>{{ item.title }}</span>
            </h3>

            <!-- Period -->
            <time class="text-sm text-gray-500 dark:text-gray-500 mb-3 block">
              {{ item.period }}
            </time>

            <!-- Description -->
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {{ item.description }}
            </p>

            <!-- Tags -->
            <div v-if="item.tags" class="flex flex-wrap gap-2">
              <span
                v-for="tag in item.tags"
                :key="tag"
                class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs font-medium"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hello-content {
  /* Ensure content is visible and properly styled */
}
</style>
