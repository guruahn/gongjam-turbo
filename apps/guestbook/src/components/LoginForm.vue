<template>
  <div class="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
      관리자 로그인
    </h2>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- 이메일 입력 -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          이메일
        </label>
        <input
          id="email"
          v-model="email"
          type="email"
          name="email"
          required
          placeholder="admin@example.com"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                 placeholder-gray-400 dark:placeholder-gray-500"
          :disabled="loading"
        />
      </div>

      <!-- 비밀번호 입력 -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          비밀번호
        </label>
        <input
          id="password"
          v-model="password"
          type="password"
          name="password"
          required
          placeholder="••••••••"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                 placeholder-gray-400 dark:placeholder-gray-500"
          :disabled="loading"
        />
      </div>

      <!-- 에러 메시지 -->
      <div v-if="errorMessage" class="text-red-600 dark:text-red-400 text-sm">
        {{ errorMessage }}
      </div>

      <!-- 로그인 버튼 -->
      <button
        type="submit"
        :disabled="loading"
        class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400
               text-white font-medium rounded-lg transition-colors duration-200
               focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {{ loading ? '로그인 중...' : '로그인' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '../composables/useAuth';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const { signIn, loading, error } = useAuth();

const email = ref('');
const password = ref('');
const errorMessage = ref<string | null>(null);

async function handleSubmit() {
  errorMessage.value = null;

  try {
    await signIn(email.value, password.value);

    // 로그인 성공 시 redirect 쿼리 파라미터가 있으면 해당 페이지로, 없으면 관리자 페이지로 이동
    const redirect = route.query.redirect as string | undefined;
    router.push(redirect || '/admin');
  } catch (e) {
    errorMessage.value = error.value || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.';
  }
}
</script>
