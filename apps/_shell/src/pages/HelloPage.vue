<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const HelloWorldApp = defineAsyncComponent(() => import('helloWorld/App'));
</script>

<template>
  <div class="hello-page">
    <Suspense>
      <template #default>
        <HelloWorldApp />
      </template>
      <template #fallback>
        <div class="loading">Loading...</div>
      </template>
    </Suspense>
  </div>
</template>

<style scoped>
.hello-page {
  width: 100%;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: #888;
}
</style>
