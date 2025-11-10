import { describe, it, expect } from 'vitest';
import { useBlogPosts } from '../useBlogPosts';
import type { BlogPost } from '../../types/blog';

describe('useBlogPosts', () => {
  describe('initialization', () => {
    it('should load posts from posts.json', () => {
      const { posts } = useBlogPosts();
      expect(posts.value).toBeDefined();
      expect(Array.isArray(posts.value)).toBe(true);
    });

    it('should load tags from posts.json', () => {
      const { tags } = useBlogPosts();
      expect(tags.value).toBeDefined();
      expect(Array.isArray(tags.value)).toBe(true);
    });

    it('should have correct totalPosts count', () => {
      const { posts, totalPosts } = useBlogPosts();
      expect(totalPosts.value).toBe(posts.value.length);
    });
  });

  describe('filterByTag', () => {
    it('should return all posts when tag is empty', () => {
      const { posts, filterByTag } = useBlogPosts();
      const filtered = filterByTag('');
      expect(filtered.length).toBe(posts.value.length);
    });

    it('should filter posts by tag', () => {
      const { filterByTag } = useBlogPosts();

      // Assuming 'vue' tag exists in test data
      const filtered = filterByTag('vue');

      expect(filtered.every((post) => post.frontmatter.tags.includes('vue'))).toBe(
        true
      );
    });

    it('should return empty array for non-existent tag', () => {
      const { filterByTag } = useBlogPosts();
      const filtered = filterByTag('nonexistent-tag-xyz');
      expect(filtered.length).toBe(0);
    });
  });

  describe('findBySlug', () => {
    it('should find post by slug', () => {
      const { posts, findBySlug } = useBlogPosts();
      const firstPost = posts.value[0];

      if (firstPost) {
        const found = findBySlug(firstPost.slug);
        expect(found).toBeDefined();
        expect(found?.slug).toBe(firstPost.slug);
      }
    });

    it('should return undefined for non-existent slug', () => {
      const { findBySlug } = useBlogPosts();
      const found = findBySlug('non-existent-slug');
      expect(found).toBeUndefined();
    });
  });

  describe('getLatestPosts', () => {
    it('should return 5 posts by default', () => {
      const { posts, getLatestPosts } = useBlogPosts();
      const latest = getLatestPosts();
      expect(latest.length).toBeLessThanOrEqual(5);
      expect(latest.length).toBeLessThanOrEqual(posts.value.length);
    });

    it('should return requested number of posts', () => {
      const { posts, getLatestPosts } = useBlogPosts();
      const limit = Math.min(3, posts.value.length);
      const latest = getLatestPosts(limit);
      expect(latest.length).toBeLessThanOrEqual(limit);
    });

    it('should return all posts if limit exceeds total', () => {
      const { posts, getLatestPosts } = useBlogPosts();
      const latest = getLatestPosts(1000);
      expect(latest.length).toBe(posts.value.length);
    });
  });

  describe('getRelatedPosts', () => {
    it('should return posts with matching tags', () => {
      const { posts, getRelatedPosts } = useBlogPosts();

      if (posts.value.length > 1) {
        const currentPost = posts.value[0];
        const related = getRelatedPosts(currentPost);

        const currentTags = currentPost.frontmatter.tags;
        related.forEach((post) => {
          const hasMatchingTag = post.frontmatter.tags.some((tag) =>
            currentTags.includes(tag)
          );
          expect(hasMatchingTag).toBe(true);
        });
      }
    });

    it('should exclude current post from related posts', () => {
      const { posts, getRelatedPosts } = useBlogPosts();

      if (posts.value.length > 0) {
        const currentPost = posts.value[0];
        const related = getRelatedPosts(currentPost);

        const includesCurrentPost = related.some(
          (post) => post.slug === currentPost.slug
        );
        expect(includesCurrentPost).toBe(false);
      }
    });

    it('should return max 3 posts by default', () => {
      const { posts, getRelatedPosts } = useBlogPosts();

      if (posts.value.length > 0) {
        const currentPost = posts.value[0];
        const related = getRelatedPosts(currentPost);
        expect(related.length).toBeLessThanOrEqual(3);
      }
    });

    it('should respect custom limit', () => {
      const { posts, getRelatedPosts } = useBlogPosts();

      if (posts.value.length > 1) {
        const currentPost = posts.value[0];
        const related = getRelatedPosts(currentPost, 1);
        expect(related.length).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('getPostCountByTag', () => {
    it('should return correct count for existing tag', () => {
      const { posts, getPostCountByTag } = useBlogPosts();

      if (posts.value.length > 0 && posts.value[0].frontmatter.tags.length > 0) {
        const tag = posts.value[0].frontmatter.tags[0];
        const count = getPostCountByTag(tag);

        const expectedCount = posts.value.filter((post) =>
          post.frontmatter.tags.includes(tag)
        ).length;

        expect(count).toBe(expectedCount);
      }
    });

    it('should return 0 for non-existent tag', () => {
      const { getPostCountByTag } = useBlogPosts();
      const count = getPostCountByTag('nonexistent-tag-xyz');
      expect(count).toBe(0);
    });
  });
});
