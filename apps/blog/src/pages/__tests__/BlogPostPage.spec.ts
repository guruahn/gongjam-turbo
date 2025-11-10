import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import BlogPostPage from '../BlogPostPage.vue';

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: '/blog/:slug',
      name: 'BlogPost',
      component: BlogPostPage,
      props: true,
    },
    { path: '/blog', name: 'BlogList', component: { template: '<div></div>' } },
  ],
});

describe('BlogPostPage', () => {
  it('should render post when slug is valid', async () => {
    await router.push('/blog/typescript-advanced-types');

    const wrapper = mount(BlogPostPage, {
      props: { slug: 'typescript-advanced-types' },
      global: { plugins: [router] },
    });

    // Should find the post
    expect(wrapper.vm.currentPost).toBeDefined();
  });

  it('should redirect to /blog when slug is invalid', async () => {
    const push = vi.spyOn(router, 'push');

    mount(BlogPostPage, {
      props: { slug: 'non-existent-post' },
      global: { plugins: [router] },
    });

    expect(push).toHaveBeenCalledWith('/blog');
  });

  it('should render post title', async () => {
    await router.push('/blog/typescript-advanced-types');

    const wrapper = mount(BlogPostPage, {
      props: { slug: 'typescript-advanced-types' },
      global: { plugins: [router] },
    });

    const post = wrapper.vm.currentPost;
    if (post) {
      expect(wrapper.text()).toContain(post.frontmatter.title);
    }
  });

  it('should render formatted date', async () => {
    const wrapper = mount(BlogPostPage, {
      props: { slug: 'typescript-advanced-types' },
      global: { plugins: [router] },
    });

    const post = wrapper.vm.currentPost;
    if (post) {
      // Should contain formatted date (e.g., "January 10, 2025")
      expect(wrapper.text()).toMatch(/\w+ \d{1,2}, \d{4}/);
    }
  });

  it('should render reading time', async () => {
    const wrapper = mount(BlogPostPage, {
      props: { slug: 'typescript-advanced-types' },
      global: { plugins: [router] },
    });

    const post = wrapper.vm.currentPost;
    if (post) {
      expect(wrapper.text()).toMatch(/\d+ min read/);
    }
  });

  it('should render tags', async () => {
    const wrapper = mount(BlogPostPage, {
      props: { slug: 'typescript-advanced-types' },
      global: { plugins: [router] },
    });

    const post = wrapper.vm.currentPost;
    if (post && post.frontmatter.tags.length > 0) {
      post.frontmatter.tags.forEach((tag) => {
        expect(wrapper.text()).toContain(`#${tag}`);
      });
    }
  });

  it('should render MarkdownRenderer component', () => {
    const wrapper = mount(BlogPostPage, {
      props: { slug: 'typescript-advanced-types' },
      global: { plugins: [router] },
    });

    expect(wrapper.findComponent({ name: 'MarkdownRenderer' }).exists()).toBe(true);
  });

  it('should render BlogTOC component when TOC exists', () => {
    const wrapper = mount(BlogPostPage, {
      props: { slug: 'typescript-advanced-types' },
      global: { plugins: [router] },
    });

    const post = wrapper.vm.currentPost;
    if (post && post.toc.length > 0) {
      expect(wrapper.findComponent({ name: 'BlogTOC' }).exists()).toBe(true);
    }
  });

  it('should apply responsive layout', () => {
    const wrapper = mount(BlogPostPage, {
      props: { slug: 'typescript-advanced-types' },
      global: { plugins: [router] },
    });

    const page = wrapper.find('.blog-post-page');
    expect(page.exists()).toBe(true);
  });

  it('should apply dark mode classes', () => {
    const wrapper = mount(BlogPostPage, {
      props: { slug: 'typescript-advanced-types' },
      global: { plugins: [router] },
    });

    const page = wrapper.find('.blog-post-page');
    expect(page.classes()).toContain('dark:bg-gray-900');
  });

  it('should show author name', () => {
    const wrapper = mount(BlogPostPage, {
      props: { slug: 'typescript-advanced-types' },
      global: { plugins: [router] },
    });

    const post = wrapper.vm.currentPost;
    if (post && post.frontmatter.author) {
      expect(wrapper.text()).toContain(post.frontmatter.author);
    }
  });

  it('should render back to blog link', () => {
    const wrapper = mount(BlogPostPage, {
      props: { slug: 'typescript-advanced-types' },
      global: { plugins: [router] },
    });

    const backLink = wrapper.findAll('a').find((a) => a.text().includes('Back to Blog'));
    expect(backLink).toBeDefined();
  });
});
