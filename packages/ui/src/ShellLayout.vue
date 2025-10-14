<template>
  <div class="shell-layout min-h-screen flex flex-col">
    <header class="shell-header bg-blue-600 text-white p-4">
      <div class="container mx-auto">
        this is header
      </div>
    </header>
    <main class="shell-body flex-1 container mx-auto p-4">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
// Shell layout component for micro-frontend architecture
// Provides consistent header and body structure across all apps
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
</style>
