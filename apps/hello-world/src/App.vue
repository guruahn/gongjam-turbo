<script setup lang="ts">
import { Button } from '@gongjam/ui';

const handleClick = (): void => {
  alert('Button clicked!');
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-800 mb-8">Hello World</h1>
      <Button @click="handleClick">Click Me</Button>
    </div>
  </div>
</template>
