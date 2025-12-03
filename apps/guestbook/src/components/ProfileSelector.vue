<template>
  <div class="profile-selector">
    <div class="flex items-center gap-2">
      <!-- 선택된 프로필 미리보기 -->
      <div class="flex-shrink-0">
        <img
          :src="PROFILE_IMAGE_URLS[modelValue]"
          :alt="`${displaySelectedProfile} 프로필`"
          class="w-10 h-10 rounded-full object-cover"
          loading="lazy"
        />
      </div>

      <!-- 셀렉트 박스 -->
      <div class="flex-1">
        <select
          :value="modelValue"
          @change="handleChange"
          class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer"
          aria-label="프로필 이미지 선택"
        >
          <option
            v-for="profile in PROFILE_IMAGES"
            :key="profile"
            :value="profile"
          >
            {{ getProfileName(profile) }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ProfileImage } from '../types/guestbook';
import { PROFILE_IMAGES, PROFILE_IMAGE_URLS } from '../types/guestbook';

interface Props {
  modelValue: ProfileImage;
}

interface Emits {
  (e: 'update:modelValue', value: ProfileImage): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value as ProfileImage);
}

// 프로필 이름 매핑 (한글화)
const profileNames: Record<ProfileImage, string> = {
  pig: '🐷 돼지',
  mouse: '🐭 생쥐',
  sheep: '🐑 양',
  hippo: '🦛 하마',
  'clown-fish': '🐠 니모',
  walrus: '🦭 바다코끼리',
  lion: '🦁 사자',
  parrot: '🦜 앵무새',
  owl: '🦉 부엉이',
  bullfinch: '🐦 홍방울새',
  crab: '🦀 게',
  panda: '🐼 판다',
  whale: '🐋 고래',
  ladybug: '🐞 무당벌레',
  frog: '🐸 개구리',
  giraffe: '🦒 기린',
  beetle: '🪲 딱정벌레',
  snake: '🐍 뱀',
  chicken: '🐔 닭',
  spider: '🕷️ 거미',
  penguin: '🐧 펭귄',
  rabbit: '🐰 토끼',
  lama: '🦙 라마',
  fox: '🦊 여우',
  flamingo: '🦩 플라밍고',
  rhino: '🦏 코뿔소',
  dog: '🐶 강아지',
  beaver: '🦫 비버',
  gorilla: '🦍 고릴라',
  zebra: '🦓 얼룩말',
};

function getProfileName(profile: ProfileImage): string {
  return profileNames[profile] || profile;
}

// 선택된 프로필 표시 이름
const displaySelectedProfile = computed(() => {
  return getProfileName(props.modelValue);
});
</script>

<style scoped>
select:focus {
  outline: none;
}
</style>
