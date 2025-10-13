<script setup lang="ts">
interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
}

withDefaults(defineProps<ButtonProps>(), {
  type: 'button',
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const handleClick = (event: MouseEvent): void => {
  emit('click', event);
};
</script>

<template>
  <button
    :type="type"
    class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
    @click="handleClick"
  >
    <slot />
  </button>
</template>
