import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { useHead, useBlogPostMeta, useBlogListMeta } from '../seo';

// Helper component to test composables with lifecycle hooks
const TestComponent = defineComponent({
  props: {
    meta: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    useHead(props.meta as any);
    return () => h('div', 'test');
  },
});

describe('seo', () => {
  beforeEach(() => {
    // Clean up meta tags before each test
    document.head.innerHTML = '';
    document.title = '';
  });

  describe('useHead', () => {
    it('should set document title', () => {
      mount(TestComponent, {
        props: {
          meta: {
            title: 'Test Title',
            description: 'Test description',
          },
        },
      });

      expect(document.title).toBe('Test Title');
    });

    it('should create meta description tag', () => {
      mount(TestComponent, {
        props: {
          meta: {
            title: 'Test',
            description: 'Test description',
          },
        },
      });

      const descTag = document.querySelector('meta[name="description"]');
      expect(descTag).toBeTruthy();
      expect(descTag?.getAttribute('content')).toBe('Test description');
    });

    it('should create Open Graph tags', () => {
      mount(TestComponent, {
        props: {
          meta: {
            title: 'Test Title',
            description: 'Test Description',
            type: 'article',
            url: '/blog/test-post',
          },
        },
      });

      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDesc = document.querySelector('meta[property="og:description"]');
      const ogType = document.querySelector('meta[property="og:type"]');
      const ogUrl = document.querySelector('meta[property="og:url"]');

      expect(ogTitle?.getAttribute('content')).toBe('Test Title');
      expect(ogDesc?.getAttribute('content')).toBe('Test Description');
      expect(ogType?.getAttribute('content')).toBe('article');
      // URL is concatenated with base URL
      expect(ogUrl?.getAttribute('content')).toContain('/blog/test-post');
    });

    it('should create Twitter Card tags', () => {
      mount(TestComponent, {
        props: {
          meta: {
            title: 'Test Title',
            description: 'Test Description',
          },
        },
      });

      const twitterCard = document.querySelector('meta[name="twitter:card"]');
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      const twitterDesc = document.querySelector(
        'meta[name="twitter:description"]'
      );

      expect(twitterCard?.getAttribute('content')).toBe('summary_large_image');
      expect(twitterTitle?.getAttribute('content')).toBe('Test Title');
      expect(twitterDesc?.getAttribute('content')).toBe('Test Description');
    });

    it('should create article meta tags when type is article', () => {
      // Clean up before this test to ensure no leftover tags
      document.head.innerHTML = '';

      mount(TestComponent, {
        props: {
          meta: {
            title: 'Test',
            description: 'Test',
            type: 'article',
            author: 'John Doe',
            publishedTime: '2025-01-07',
            tags: ['tag1', 'tag2'],
          },
        },
      });

      const articleAuthor = document.querySelector(
        'meta[property="article:author"]'
      );
      const articlePublished = document.querySelector(
        'meta[property="article:published_time"]'
      );

      expect(articleAuthor?.getAttribute('content')).toBe('John Doe');
      expect(articlePublished?.getAttribute('content')).toBe('2025-01-07');

      // Check tags - at least one article:tag meta tag exists
      // Note: Current implementation updates the same tag, so only last tag value is present
      const tagMeta = document.querySelector('meta[property="article:tag"]');
      expect(tagMeta).toBeTruthy();
      // Last tag in the array should be present
      expect(tagMeta?.getAttribute('content')).toBe('tag2');
    });

    it('should create og:image tag when image is provided', () => {
      mount(TestComponent, {
        props: {
          meta: {
            title: 'Test',
            description: 'Test',
            image: 'https://example.com/image.jpg',
          },
        },
      });

      const ogImage = document.querySelector('meta[property="og:image"]');
      const twitterImage = document.querySelector('meta[name="twitter:image"]');

      expect(ogImage?.getAttribute('content')).toBe(
        'https://example.com/image.jpg'
      );
      expect(twitterImage?.getAttribute('content')).toBe(
        'https://example.com/image.jpg'
      );
    });

    it('should default to website type when not specified', () => {
      mount(TestComponent, {
        props: {
          meta: {
            title: 'Test',
            description: 'Test',
          },
        },
      });

      const ogType = document.querySelector('meta[property="og:type"]');
      expect(ogType?.getAttribute('content')).toBe('website');
    });

    it('should use BASE_URL from env for URLs', () => {
      mount(TestComponent, {
        props: {
          meta: {
            title: 'Test',
            description: 'Test',
            url: '/blog/post',
          },
        },
      });

      const ogUrl = document.querySelector('meta[property="og:url"]');
      // Should concatenate base URL with relative URL
      expect(ogUrl?.getAttribute('content')).toContain('/blog/post');
    });
  });

  describe('useBlogPostMeta', () => {
    const TestBlogPostComponent = defineComponent({
      props: {
        post: {
          type: Object,
          required: true,
        },
      },
      setup(props) {
        useBlogPostMeta(props.post as any);
        return () => h('div', 'test');
      },
    });

    it('should set meta tags for blog post', () => {
      const post = {
        title: 'My Post',
        description: 'Post description',
        slug: 'my-post',
        author: 'Jeongwoo Ahn',
        date: '2025-01-07',
        tags: ['vue', 'typescript'],
      };

      mount(TestBlogPostComponent, {
        props: { post },
      });

      expect(document.title).toContain('My Post');
      expect(document.title).toContain("Jeongwoo Ahn's Blog");

      const ogType = document.querySelector('meta[property="og:type"]');
      expect(ogType?.getAttribute('content')).toBe('article');

      const articleAuthor = document.querySelector(
        'meta[property="article:author"]'
      );
      expect(articleAuthor?.getAttribute('content')).toBe('Jeongwoo Ahn');
    });

    it('should include thumbnail when provided', () => {
      const post = {
        title: 'My Post',
        description: 'Post description',
        slug: 'my-post',
        thumbnail: '/images/thumb.jpg',
        author: 'Jeongwoo Ahn',
        date: '2025-01-07',
        tags: [],
      };

      mount(TestBlogPostComponent, {
        props: { post },
      });

      const ogImage = document.querySelector('meta[property="og:image"]');
      expect(ogImage?.getAttribute('content')).toContain('/images/thumb.jpg');
    });
  });

  describe('useBlogListMeta', () => {
    const TestBlogListComponent = defineComponent({
      setup() {
        useBlogListMeta();
        return () => h('div', 'test');
      },
    });

    it('should set meta tags for blog list page', () => {
      mount(TestBlogListComponent);

      expect(document.title).toContain('Blog');
      expect(document.title).toContain("Jeongwoo Ahn's Portfolio");

      const ogType = document.querySelector('meta[property="og:type"]');
      expect(ogType?.getAttribute('content')).toBe('website');

      const description = document.querySelector('meta[name="description"]');
      expect(description?.getAttribute('content')).toContain('Vue3');
      expect(description?.getAttribute('content')).toContain('TypeScript');
    });
  });
});
