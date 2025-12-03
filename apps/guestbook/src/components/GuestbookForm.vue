<template>
  <div class="guestbook-form bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      방명록 작성
    </h2>

    <form @submit.prevent="handleSubmit">
      <!-- 닉네임 + 프로필 이미지 (한 줄) -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          닉네임 & 프로필 <span class="text-red-500">*</span>
        </label>
        <div class="flex gap-3">
          <!-- 닉네임 입력 (왼쪽, 넓게) -->
          <div class="flex-1">
            <input
              id="nickname"
              v-model="formData.nickname"
              type="text"
              name="nickname"
              maxlength="20"
              placeholder="닉네임 (최대 20자)"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              :class="{ 'border-red-500': errors.nickname }"
              required
            />
            <p v-if="errors.nickname" class="mt-1 text-sm text-red-500">
              {{ errors.nickname }}
            </p>
            <p v-else class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {{ formData.nickname.length }}/20자
            </p>
          </div>

          <!-- 프로필 이미지 선택 (오른쪽, 좁게) -->
          <div class="w-48">
            <ProfileSelector v-model="formData.profile_image" />
            <p v-if="errors.profile_image" class="mt-1 text-sm text-red-500">
              {{ errors.profile_image }}
            </p>
          </div>
        </div>
      </div>

      <!-- 메시지 입력 -->
      <div class="mb-6">
        <label
          for="message"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          메시지 <span class="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          v-model="formData.message"
          name="message"
          rows="3"
          maxlength="280"
          placeholder="방문 후기를 남겨주세요 (최대 280자)"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none"
          :class="{ 'border-red-500': errors.message }"
          required
        ></textarea>
        <p v-if="errors.message" class="mt-1 text-sm text-red-500">
          {{ errors.message }}
        </p>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {{ formData.message.length }}/280자
        </p>
      </div>

      <!-- 제출 버튼 -->
      <button
        type="submit"
        :disabled="loading || !isFormValid"
        class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <span v-if="loading">작성 중...</span>
        <span v-else>작성하기</span>
      </button>

      <!-- 성공 메시지 -->
      <div
        v-if="submitSuccess"
        class="mt-4 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-200 rounded-lg"
      >
        방명록이 성공적으로 작성되었습니다! 관리자 승인 후 공개됩니다.
      </div>

      <!-- 에러 메시지 -->
      <div
        v-if="submitError"
        class="mt-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-lg"
      >
        {{ submitError }}
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import ProfileSelector from './ProfileSelector.vue';
import { useGuestbook } from '../composables/useGuestbook';
import {
  validateGuestbookForm,
  isSpam,
  type ValidationError,
} from '../utils/validation';
import type { GuestbookFormData, ProfileImage } from '../types/guestbook';
import { PROFILE_IMAGES } from '../types/guestbook';

// Composable
const { createEntry } = useGuestbook();

// 폼 데이터
const formData = reactive<GuestbookFormData>({
  nickname: '',
  profile_image: getRandomProfile(),
  message: '',
});

// 상태
const loading = ref(false);
const submitSuccess = ref(false);
const submitError = ref<string | null>(null);
const errors = reactive<Record<string, string>>({
  nickname: '',
  profile_image: '',
  message: '',
});

// 랜덤 프로필 선택
function getRandomProfile(): ProfileImage {
  const randomIndex = Math.floor(Math.random() * PROFILE_IMAGES.length);
  return PROFILE_IMAGES[randomIndex] as ProfileImage;
}

// 폼 유효성 검사
const isFormValid = computed(() => {
  return (
    formData.nickname.trim().length > 0 &&
    formData.message.trim().length > 0 &&
    formData.nickname.length <= 20 &&
    formData.message.length <= 280
  );
});

// 에러 초기화
function clearErrors() {
  errors.nickname = '';
  errors.profile_image = '';
  errors.message = '';
}

// 폼 제출
async function handleSubmit() {
  clearErrors();
  submitSuccess.value = false;
  submitError.value = null;

  // 클라이언트 검증
  const validationErrors: ValidationError[] = validateGuestbookForm(formData);

  if (validationErrors.length > 0) {
    validationErrors.forEach((error) => {
      errors[error.field] = error.message;
    });
    return;
  }

  // 스팸 검사
  if (isSpam(formData)) {
    submitError.value =
      '스팸으로 감지되었습니다. URL이나 부적절한 내용이 포함되어 있지 않은지 확인해주세요.';
    return;
  }

  loading.value = true;

  try {
    // 방명록 작성
    await createEntry(formData);

    // 성공
    submitSuccess.value = true;

    // 폼 초기화 (닉네임 제외)
    formData.message = '';
    formData.profile_image = getRandomProfile();

    // 3초 후 성공 메시지 숨기기
    setTimeout(() => {
      submitSuccess.value = false;
    }, 3000);
  } catch (error) {
    submitError.value =
      error instanceof Error ? error.message : '방명록 작성에 실패했습니다.';
  } finally {
    loading.value = false;
  }
}
</script>
