import { ref, computed } from 'vue';
import { supabase } from '../utils/supabase';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // 현재 사용자 가져오기
  async function getCurrentUser() {
    try {
      const {
        data: { user: currentUser },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      user.value = currentUser;
      return currentUser;
    } catch (e) {
      console.error('Failed to get current user:', e);
      user.value = null;
      return null;
    }
  }

  // 로그인
  async function signIn(email: string, password: string) {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      user.value = data.user;
      return data;
    } catch (e) {
      error.value = e instanceof Error ? e.message : '로그인에 실패했습니다.';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  // 로그아웃
  async function signOut() {
    loading.value = true;
    error.value = null;

    try {
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        throw signOutError;
      }

      user.value = null;
    } catch (e) {
      error.value = e instanceof Error ? e.message : '로그아웃에 실패했습니다.';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  // 인증 상태 확인
  const isAuthenticated = computed(() => user.value !== null);

  // 관리자 권한 확인
  async function isAdmin(): Promise<boolean> {
    if (!user.value) {
      return false;
    }

    try {
      // admin_users 테이블에서 현재 사용자 확인
      const { data, error: adminError } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', user.value.id)
        .single();

      if (adminError || !data) {
        return false;
      }

      return true;
    } catch (e) {
      console.error('Failed to check admin status:', e);
      return false;
    }
  }

  // 인증 상태 변경 리스너 설정
  function setupAuthListener() {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        user.value = session?.user || null;

        if (event === 'SIGNED_IN') {
          console.log('User signed in:', user.value?.email);
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
        }
      }
    );

    return authListener;
  }

  // 초기화 시 현재 사용자 가져오기
  getCurrentUser();

  // 인증 상태 리스너 설정
  const authListener = setupAuthListener();

  return {
    user,
    loading,
    error,
    isAuthenticated,
    signIn,
    signOut,
    isAdmin,
    getCurrentUser,
    authListener,
  };
}
