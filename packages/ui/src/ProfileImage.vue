<template>
  <img
    :src="profileImageUrl"
    alt="Jeongwoo Ahn Profile Photo"
    :class="imageClass"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import profileImage from './assets/my-face-transparent.png';

interface Props {
  size?: 'small' | 'medium' | 'large' | 'custom';
  customClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  customClass: '',
});

const profileImageUrl = profileImage;

const imageClass = computed(() => {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-32 h-32',
    large: 'w-48 h-48',
    custom: props.customClass,
  };

  const baseClasses = 'rounded-full object-cover';
  return `${baseClasses} ${sizeClasses[props.size]}`;
});
</script>
