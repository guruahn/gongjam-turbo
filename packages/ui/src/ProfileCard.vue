<template>
  <div
    class="profile-card bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sticky top-20"
  >
    <!-- Profile Image -->
    <div class="flex justify-center mb-3">
      <ProfileImage size="medium" custom-class="w-24 h-24" />
    </div>

    <!-- Name -->
    <h2
      class="text-xl font-bold text-gray-900 dark:text-white text-center mb-1"
    >
      Jeongwoo Ahn
    </h2>

    <!-- Title -->
    <p class="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
      Web Developer
    </p>

    <!-- Contact Information (Desktop only) -->
    <div class="contact-info space-y-2 text-sm hidden lg:block">
      <!-- Divider -->
      <div class="border-t border-gray-200 dark:border-gray-700 mb-3"></div>

      <!-- Email -->
      <div class="flex items-center space-x-2">
        <span class="text-lg">📧</span>
        <div class="overflow-hidden">
          <p class="text-xs text-gray-500 dark:text-gray-500">Email</p>
          <a
            href="mailto:guruahn@gmail.com"
            class="text-blue-600 dark:text-blue-400 hover:underline text-xs truncate block"
          >
            guruahn@gmail.com
          </a>
        </div>
      </div>

      <!-- Location -->
      <div class="flex items-center space-x-2">
        <span class="text-lg">📍</span>
        <div>
          <p class="text-xs text-gray-500 dark:text-gray-500">Location</p>
          <p class="text-gray-900 dark:text-gray-100 text-xs">
            Seoul, South Korea
          </p>
        </div>
      </div>

      <!-- GitHub -->
      <div class="flex items-center space-x-2">
        <span class="text-lg">🐙</span>
        <div class="overflow-hidden">
          <p class="text-xs text-gray-500 dark:text-gray-500">GitHub</p>
          <a
            href="https://github.com/guruahn"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-600 dark:text-blue-400 hover:underline text-xs truncate block"
          >
            github.com/guruahn
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProfileImage from './ProfileImage.vue';
</script>

<style scoped>
.profile-card {
  /* Ensure sticky positioning works correctly */
  position: sticky;
}
</style>
