<script setup lang="ts">
import { portfolio, techStack } from './data/portfolio';
</script>

<template>
  <div class="hello-content space-y-8">
    <!-- Greeting Section -->
    <section class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
      <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        👋 Hola, Good Day!
      </h2>
      <div class="prose prose-lg dark:prose-invert max-w-none">
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
          I'm a passionate full-stack developer specializing in modern web technologies and scalable architectures.
          With expertise in Vue.js, TypeScript, and microservices, I build high-performance applications that deliver exceptional user experiences.
          Always exploring cutting-edge technologies and contributing to the open-source community.
        </p>
      </div>
    </section>

    <!-- Tech Stack Section -->
    <section class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        🛠️ Tech Stack
      </h2>
      <div class="space-y-6">
        <div v-for="category in techStack" :key="category.name">
          <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
            {{ category.name }}
          </h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tech in category.items"
              :key="tech"
              class="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg font-medium text-sm"
            >
              {{ tech }}
            </span>
          </div>
        </div>
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
