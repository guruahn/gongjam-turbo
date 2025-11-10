import { ref, computed } from 'vue';
import type { BlogPost, BlogMetadata } from '../types/blog';
import postsData from '../generated/posts.json';

// 빌드 시 생성된 posts.json 로드
const metadata = postsData as BlogMetadata;

/**
 * 블로그 포스트 데이터를 관리하는 composable
 */
export function useBlogPosts() {
  const posts = ref<BlogPost[]>(metadata.posts);
  const tags = ref<string[]>(metadata.tags);

  /**
   * 태그로 포스트 필터링
   */
  const filterByTag = (tag: string): BlogPost[] => {
    if (!tag) return posts.value;
    return posts.value.filter((post) =>
      post.frontmatter.tags.includes(tag)
    );
  };

  /**
   * slug로 포스트 찾기
   */
  const findBySlug = (slug: string): BlogPost | undefined => {
    return posts.value.find((post) => post.slug === slug);
  };

  /**
   * 최신 포스트 가져오기
   */
  const getLatestPosts = (limit: number = 5): BlogPost[] => {
    return posts.value.slice(0, limit);
  };

  /**
   * 관련 포스트 찾기 (같은 태그를 가진 포스트)
   */
  const getRelatedPosts = (currentPost: BlogPost, limit: number = 3): BlogPost[] => {
    const currentTags = currentPost.frontmatter.tags;

    return posts.value
      .filter((post) => post.slug !== currentPost.slug)
      .filter((post) =>
        post.frontmatter.tags.some((tag) => currentTags.includes(tag))
      )
      .slice(0, limit);
  };

  /**
   * 총 포스트 개수
   */
  const totalPosts = computed(() => posts.value.length);

  /**
   * 태그별 포스트 개수
   */
  const getPostCountByTag = (tag: string): number => {
    return posts.value.filter((post) =>
      post.frontmatter.tags.includes(tag)
    ).length;
  };

  return {
    posts,
    tags,
    totalPosts,
    filterByTag,
    findBySlug,
    getLatestPosts,
    getRelatedPosts,
    getPostCountByTag,
  };
}
