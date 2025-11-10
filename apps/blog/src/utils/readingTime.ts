/**
 * 텍스트의 읽기 시간 계산 (분 단위)
 * 평균 읽기 속도: 200 단어/분 (한국어/영어 혼용 고려)
 */
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;

  // HTML 태그 제거
  const cleanText = text.replace(/<[^>]+>/g, '');

  // 단어 수 계산 (공백 기준)
  const words = cleanText.trim().split(/\s+/).length;

  // 읽기 시간 계산 (최소 1분)
  const minutes = Math.ceil(words / wordsPerMinute);
  return Math.max(1, minutes);
}

/**
 * 읽기 시간을 사람이 읽기 쉬운 형식으로 변환
 * 예: 1 -> "1 min read", 5 -> "5 min read"
 */
export function formatReadingTime(minutes: number): string {
  return `${minutes} min read`;
}
