import type { TableOfContentsItem } from '../types/blog';

/**
 * HTML에서 목차(Table of Contents) 추출
 * H2, H3 태그를 기반으로 목차 생성
 */
export function generateTOC(html: string): TableOfContentsItem[] {
  const headingRegex = /<h([23])\s+id="([^"]+)">(.+?)<\/h[23]>/g;
  const toc: TableOfContentsItem[] = [];

  let match;
  while ((match = headingRegex.exec(html)) !== null) {
    if (!match[1] || !match[2] || !match[3]) continue;

    const level = parseInt(match[1], 10);
    const id = match[2];
    // HTML 태그 제거
    const text = match[3].replace(/<[^>]+>/g, '').trim();

    toc.push({
      level,
      text,
      id,
    });
  }

  return toc;
}

/**
 * 마크다운 텍스트에서 직접 목차 추출 (HTML 렌더링 전)
 */
export function generateTOCFromMarkdown(markdown: string): TableOfContentsItem[] {
  const lines = markdown.split('\n');
  const toc: TableOfContentsItem[] = [];

  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match && match[1] && match[2]) {
      const level = match[1].length;
      const text = match[2].trim();
      // ID는 kebab-case로 생성
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

      toc.push({
        level,
        text,
        id,
      });
    }
  }

  return toc;
}
