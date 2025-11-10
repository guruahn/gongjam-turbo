/**
 * 블로그 글의 Frontmatter (YAML 메타데이터)
 */
export interface BlogPostFrontmatter {
  title: string;
  date: string; // ISO 8601 format (YYYY-MM-DD)
  tags: string[];
  description: string;
  thumbnail?: string; // 선택적
  draft?: boolean; // 기본값: false
  author?: string; // 기본값: "Jeongwoo Ahn"
}

/**
 * 블로그 글 전체 데이터
 */
export interface BlogPost {
  id: string; // 파일명 기반 slug (예: "my-first-post")
  slug: string; // URL slug (예: "my-first-post")
  frontmatter: BlogPostFrontmatter;
  content: string; // 마크다운 원본
  html: string; // 렌더링된 HTML
  readingTime: number; // 분 단위
  toc: TableOfContentsItem[]; // 목차
}

/**
 * 목차(Table of Contents) 항목
 */
export interface TableOfContentsItem {
  level: number; // 1, 2, 3 (H1, H2, H3)
  text: string;
  id: string; // anchor ID
}

/**
 * 블로그 메타데이터 (빌드 시 생성)
 */
export interface BlogMetadata {
  posts: BlogPost[];
  tags: string[]; // 모든 태그 목록
  totalPosts: number;
  lastUpdated: string; // ISO 8601
}
