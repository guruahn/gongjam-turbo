import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import BlogCard from '../BlogCard.vue';
import type { BlogPost } from '../../types/blog';

const mockPost: BlogPost = {
  id: 'test-post',
  slug: 'test-post',
  frontmatter: {
    title: 'Test Post Title',
    date: '2025-01-07',
    tags: ['vue', 'typescript'],
    description: 'This is a test post description',
    thumbnail: '/images/test.jpg',
    author: 'Test Author',
  },
  content: '',
  html: '',
  readingTime: 5,
  toc: [],
};

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/blog/:slug', name: 'BlogPost', component: { template: '<div/>' } },
  ],
});

describe('BlogCard', () => {
  it('should render post title', () => {
    const wrapper = mount(BlogCard, {
      props: { post: mockPost },
      global: { plugins: [router] },
    });

    expect(wrapper.text()).toContain('Test Post Title');
  });

  it('should render post description', () => {
    const wrapper = mount(BlogCard, {
      props: { post: mockPost },
      global: { plugins: [router] },
    });

    expect(wrapper.text()).toContain('This is a test post description');
  });

  it('should render formatted date', () => {
    const wrapper = mount(BlogCard, {
      props: { post: mockPost },
      global: { plugins: [router] },
    });

    expect(wrapper.text()).toContain('Jan 07, 2025');
  });

  it('should render reading time', () => {
    const wrapper = mount(BlogCard, {
      props: { post: mockPost },
      global: { plugins: [router] },
    });

    expect(wrapper.text()).toContain('5 min read');
  });

  it('should render all tags with hashtag', () => {
    const wrapper = mount(BlogCard, {
      props: { post: mockPost },
      global: { plugins: [router] },
    });

    expect(wrapper.text()).toContain('#vue');
    expect(wrapper.text()).toContain('#typescript');
  });

  it('should render thumbnail when provided', () => {
    const wrapper = mount(BlogCard, {
      props: { post: mockPost },
      global: { plugins: [router] },
    });

    const img = wrapper.find('img');
    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toBe('/images/test.jpg');
    expect(img.attributes('alt')).toBe('Test Post Title');
  });

  it('should not render thumbnail when not provided', () => {
    const postWithoutThumb = {
      ...mockPost,
      frontmatter: {
        ...mockPost.frontmatter,
        thumbnail: undefined,
      },
    };

    const wrapper = mount(BlogCard, {
      props: { post: postWithoutThumb },
      global: { plugins: [router] },
    });

    const img = wrapper.find('img');
    expect(img.exists()).toBe(false);
  });

  it('should link to blog post page', () => {
    const wrapper = mount(BlogCard, {
      props: { post: mockPost },
      global: { plugins: [router] },
    });

    const link = wrapper.find('a');
    expect(link.exists()).toBe(true);
    expect(link.attributes('href')).toBe('/blog/test-post');
  });

  it('should apply hover effect styles', () => {
    const wrapper = mount(BlogCard, {
      props: { post: mockPost },
      global: { plugins: [router] },
    });

    const card = wrapper.find('.blog-card');
    expect(card.exists()).toBe(true);
    expect(card.classes()).toContain('group');
    expect(card.classes()).toContain('hover:shadow-xl');
  });

  it('should apply dark mode classes', () => {
    const wrapper = mount(BlogCard, {
      props: { post: mockPost },
      global: { plugins: [router] },
    });

    const card = wrapper.find('.blog-card');
    expect(card.classes()).toContain('dark:bg-gray-800');
  });
});
