import type { GuestbookFormData, ProfileImage } from '../types/guestbook';
import { PROFILE_IMAGES } from '../types/guestbook';

export interface ValidationError {
  field: string;
  message: string;
}

// 닉네임 검증
export function validateNickname(nickname: string): ValidationError | null {
  if (!nickname || nickname.trim().length === 0) {
    return {
      field: 'nickname',
      message: '닉네임을 입력해주세요.',
    };
  }

  if (nickname.length > 20) {
    return {
      field: 'nickname',
      message: '닉네임은 20자 이하로 입력해주세요.',
    };
  }

  return null;
}

// 메시지 검증
export function validateMessage(message: string): ValidationError | null {
  if (!message || message.trim().length === 0) {
    return {
      field: 'message',
      message: '메시지를 입력해주세요.',
    };
  }

  if (message.length > 280) {
    return {
      field: 'message',
      message: '메시지는 280자 이하로 입력해주세요.',
    };
  }

  return null;
}

// 프로필 이미지 검증
export function validateProfileImage(
  profileImage: string
): ValidationError | null {
  if (!PROFILE_IMAGES.includes(profileImage as ProfileImage)) {
    return {
      field: 'profile_image',
      message: '유효하지 않은 프로필 이미지입니다.',
    };
  }

  return null;
}

// 전체 폼 검증
export function validateGuestbookForm(
  formData: GuestbookFormData
): ValidationError[] {
  const errors: ValidationError[] = [];

  const nicknameError = validateNickname(formData.nickname);
  if (nicknameError) {
    errors.push(nicknameError);
  }

  const messageError = validateMessage(formData.message);
  if (messageError) {
    errors.push(messageError);
  }

  const profileImageError = validateProfileImage(formData.profile_image);
  if (profileImageError) {
    errors.push(profileImageError);
  }

  return errors;
}

// HTML 이스케이프 (XSS 방지)
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };

  return text.replace(/[&<>"']/g, (m) => map[m] || m);
}

// URL 패턴 감지 (스팸 방지)
export function containsUrl(text: string): boolean {
  const urlPattern =
    /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/gi;
  return urlPattern.test(text);
}

// 욕설 필터링 (기본 목록, 확장 가능)
const PROFANITY_LIST = ['욕설1', '욕설2', '비속어']; // 실제 구현 시 확장 필요

export function containsProfanity(text: string): boolean {
  return PROFANITY_LIST.some((word) => text.includes(word));
}

// 종합 스팸 검사
export function isSpam(formData: GuestbookFormData): boolean {
  // URL 포함 여부 체크
  if (containsUrl(formData.message)) {
    return true;
  }

  // 욕설 포함 여부 체크
  if (containsProfanity(formData.message)) {
    return true;
  }

  // 같은 문자 반복 체크 (예: aaaaaaa)
  const repeatedCharPattern = /(.)\1{9,}/;
  if (repeatedCharPattern.test(formData.message)) {
    return true;
  }

  return false;
}
