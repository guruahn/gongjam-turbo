<script setup lang="ts">
import { ProfileImage } from '@gongjam/ui';

// Portfolio item interface
interface PortfolioItem {
  id: string;
  icon: string;
  title: string;
  link?: string;
  period: string;
  description: string;
  tags?: string[];
}

// Tech stack interface
interface TechCategory {
  name: string;
  items: string[];
}

// Portfolio data
const portfolio: PortfolioItem[] = [
  {
    id: '1',
    icon: '💼',
    title: 'Senior Software Engineer at Tech Company',
    link: '#',
    period: '2020 - Present',
    description: 'Leading full-stack development initiatives, architecting microservices, and mentoring junior developers. Implemented scalable solutions serving millions of users with 99.9% uptime.',
    tags: ['Vue3', 'TypeScript', 'Node.js', 'AWS'],
  },
  {
    id: '2',
    icon: '🚀',
    title: 'Full Stack Developer at Startup',
    link: '#',
    period: '2018 - 2020',
    description: 'Built MVPs from scratch, implemented real-time features, and optimized application performance. Contributed to 3x user growth through innovative features and seamless UX.',
    tags: ['React', 'Python', 'Docker', 'PostgreSQL'],
  },
  {
    id: '3',
    icon: '🌟',
    title: 'Open Source Contributions',
    link: 'https://github.com/guruahn',
    period: '2017 - Present',
    description: 'Active contributor to Vue.js ecosystem and various open-source projects. Maintained popular npm packages with 50K+ weekly downloads and resolved 200+ issues.',
    tags: ['Vue', 'JavaScript', 'Open Source'],
  },
  {
    id: '4',
    icon: '🎓',
    title: 'Computer Science Degree',
    period: '2014 - 2018',
    description: 'Bachelor of Science in Computer Science with focus on software engineering, algorithms, and distributed systems. Graduated with honors and published research on web performance optimization.',
    tags: ['Algorithms', 'Data Structures', 'Distributed Systems'],
  },
];

// Tech stack data
const techStack: TechCategory[] = [
  {
    name: 'Frontend',
    items: ['Vue', 'React', 'TypeScript', 'Tailwind CSS'],
  },
  {
    name: 'Backend',
    items: ['Node.js', 'Python', 'PostgreSQL', 'Redis'],
  },
];
</script>

<template>
  <div class="profile-page min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
    <div class="container mx-auto max-w-7xl">
      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Left Column: Profile Card -->
        <aside class="lg:col-span-1">
          <div class="profile-card bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 sticky top-24">
            <!-- Profile Image -->
            <div class="flex justify-center mb-6">
              <ProfileImage size="large" custom-class="w-40 h-40" />
            </div>

            <!-- Name -->
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Jeongwoo Ahn
            </h1>

            <!-- Title -->
            <p class="text-lg text-gray-600 dark:text-gray-400 text-center mb-6">
              Full Stack Developer
            </p>

            <!-- Divider -->
            <div class="border-t border-gray-200 dark:border-gray-700 my-6"></div>

            <!-- Contact Information -->
            <div class="space-y-4">
              <!-- Email -->
              <div class="flex items-center space-x-3">
                <span class="text-2xl">📧</span>
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-500">Email</p>
                  <a
                    href="mailto:guruahn@gmail.com"
                    class="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    guruahn@gmail.com
                  </a>
                </div>
              </div>

              <!-- Location -->
              <div class="flex items-center space-x-3">
                <span class="text-2xl">📍</span>
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-500">Location</p>
                  <p class="text-gray-900 dark:text-gray-100">Seoul, South Korea</p>
                </div>
              </div>

              <!-- GitHub -->
              <div class="flex items-center space-x-3">
                <span class="text-2xl">🐙</span>
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-500">GitHub</p>
                  <a
                    href="https://github.com/guruahn"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    github.com/guruahn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <!-- Right Column: Main Content -->
        <main class="lg:col-span-2 space-y-8">
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
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  /* Ensure content is visible and properly styled */
}
</style>
