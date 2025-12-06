<template>
  <div
    :class="[
      'shell-layout',
      'min-h-screen',
      'flex',
      'flex-col',
      { dark: isDarkMode },
    ]"
  >
    <!-- Navigation Bar -->
    <header
      class="shell-header bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50"
    >
      <nav class="container mx-auto max-w-screen-lg px-4 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <div class="flex items-center">
            <router-link to="/" class="flex items-center">
              <!-- Desktop: Text Logo -->
              <span
                class="hidden md:block text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Jeongwoo Ahn
              </span>
              <!-- Mobile: Profile Image -->
              <ProfileImage size="custom" custom-class="md:hidden w-14 h-14" />
            </router-link>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-8">
            <router-link
              to="/hello"
              class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              active-class="text-blue-600 dark:text-blue-400"
            >
              Hello
            </router-link>
            <router-link
              to="/blog"
              class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              active-class="text-blue-600 dark:text-blue-400"
            >
              Blog
            </router-link>
            <router-link
              to="/guestbook"
              class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              active-class="text-blue-600 dark:text-blue-400"
            >
              GuestBook
            </router-link>

            <!-- Dark Mode Toggle -->
            <button
              @click="toggleDarkMode"
              class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              <span class="text-xl">{{ isDarkMode ? '☀️' : '🌙' }}</span>
            </button>
          </div>

          <!-- Mobile Menu Button & Dark Mode Toggle -->
          <div class="md:hidden flex items-center space-x-2">
            <button
              @click="toggleDarkMode"
              class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              <span class="text-xl">{{ isDarkMode ? '☀️' : '🌙' }}</span>
            </button>
            <button
              @click="toggleMobileMenu"
              class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle menu"
            >
              <span class="text-2xl">{{ isMobileMenuOpen ? '✕' : '☰' }}</span>
            </button>
          </div>
        </div>

        <!-- Mobile Navigation Menu -->
        <div
          v-if="isMobileMenuOpen"
          class="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4"
        >
          <div class="flex flex-col space-y-4">
            <router-link
              to="/hello"
              class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              active-class="text-blue-600 dark:text-blue-400"
              @click="closeMobileMenu"
            >
              Hello
            </router-link>
            <router-link
              to="/blog"
              class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              active-class="text-blue-600 dark:text-blue-400"
              @click="closeMobileMenu"
            >
              Blog
            </router-link>
            <router-link
              to="/guestbook"
              class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              active-class="text-blue-600 dark:text-blue-400"
              @click="closeMobileMenu"
            >
              GuestBook
            </router-link>
          </div>
        </div>
      </nav>
    </header>

    <!-- Main Content Area -->
    <main class="shell-body flex-1 bg-gray-50 dark:bg-gray-800">
      <div class="container mx-auto max-w-screen-lg px-4 py-6">
        <div class="grid lg:grid-cols-3 gap-6">
          <!-- Profile Card (Left Column - 1/3) - Visible on mobile for / and /hello -->
          <aside
            :class="[
              'lg:col-span-1',
              shouldShowProfileOnMobile ? 'block' : 'hidden lg:block',
            ]"
          >
            <ProfileCard />
          </aside>

          <!-- Router Content (Right Column - 2/3, Full Width on Mobile) -->
          <div class="lg:col-span-2">
            <slot />
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer
      class="shell-footer bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-8"
    >
      <div class="container mx-auto max-w-screen-lg px-4">
        <div class="flex flex-col items-center space-y-4">
          <!-- Social Links -->
          <div class="flex items-center space-x-6">
            <a
              href="https://github.com/guruahn"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              aria-label="GitHub"
            >
              <span class="text-2xl">🐙</span>
              <span class="text-sm font-medium">github.com/guruahn</span>
            </a>
            <a
              href="https://medium.com/@jeongwooahn"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              aria-label="Medium Blog"
            >
              <span class="text-2xl">📝</span>
              <span class="text-sm font-medium">Old Blog</span>
            </a>
            <a
              href="mailto:guruahn@gmail.com"
              class="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              aria-label="Email"
            >
              <span class="text-2xl">📧</span>
              <span class="text-sm font-medium">guruahn@gmail.com</span>
            </a>
          </div>

          <!-- Copyright -->
          <div class="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Copyright © 2025 • Jeongwoo Ahn</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import ProfileCard from './ProfileCard.vue';
import ProfileImage from './ProfileImage.vue';

// Dark mode state
const isDarkMode = ref<boolean>(false);

// Mobile menu state
const isMobileMenuOpen = ref<boolean>(false);

// Router for navigation
const router = useRouter();

// Check if current route should show profile on mobile
const shouldShowProfileOnMobile = computed(() => {
  const path = router.currentRoute.value.path;
  return path === '/' || path === '/hello';
});

// Initialize dark mode from localStorage or system preference
const initializeDarkMode = (): void => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    isDarkMode.value = savedTheme === 'dark';
  } else {
    // Check system preference
    isDarkMode.value = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
  }
  applyDarkMode();
};

// Apply dark mode to document
const applyDarkMode = (): void => {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// Toggle dark mode
const toggleDarkMode = (): void => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
  applyDarkMode();
};

// Toggle mobile menu
const toggleMobileMenu = (): void => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

// Close mobile menu
const closeMobileMenu = (): void => {
  isMobileMenuOpen.value = false;
};

// Watch for route changes and close mobile menu
watch(
  () => router.currentRoute.value.path,
  () => {
    closeMobileMenu();
  }
);

// Initialize on mount
onMounted(() => {
  initializeDarkMode();
});
</script>

<style scoped>
.shell-layout {
  display: flex;
  flex-direction: column;
}

.shell-header {
  flex-shrink: 0;
}

.shell-body {
  flex-grow: 1;
}

.shell-footer {
  flex-shrink: 0;
}
</style>
