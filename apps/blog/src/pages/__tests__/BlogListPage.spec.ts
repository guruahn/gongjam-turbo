import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import BlogListPage from '../BlogListPage.vue';

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/blog', name: 'BlogList', component: BlogListPage },
    {
      path: '/blog/tag/:tag',
      name: 'BlogTagFilter',
      component: BlogListPage,
      props: true,
    },
  ],
});

describe('BlogListPage', () => {
  it('should render page heading', () => {
    const wrapper = mount(BlogListPage, {
      global: { plugins: [router] },
    });

    expect(wrapper.text()).toContain('Blog');
  });

  it('should render tagline', () => {
    const wrapper = mount(BlogListPage, {
      global: { plugins: [router] },
    });

    expect(wrapper.text()).toContain('Thoughts on development, design, and technology');
  });

  it('should render TagFilter component', () => {
    const wrapper = mount(BlogListPage, {
      global: { plugins: [router] },
    });

    expect(wrapper.findComponent({ name: 'TagFilter' }).exists()).toBe(true);
  });

  it('should render BlogCard components for posts', () => {
    const wrapper = mount(BlogListPage, {
      global: { plugins: [router] },
    });

    const cards = wrapper.findAllComponents({ name: 'BlogCard' });
    expect(cards.length).toBeGreaterThan(0);
  });

  it('should display post count', () => {
    const wrapper = mount(BlogListPage, {
      global: { plugins: [router] },
    });

    const text = wrapper.text();
    expect(text).toMatch(/\d+ posts?/);
  });

  it('should filter posts by tag prop', () => {
    const wrapper = mount(BlogListPage, {
      props: { tag: 'vue' },
      global: { plugins: [router] },
    });

    // Should show posts filtered by tag
    const cards = wrapper.findAllComponents({ name: 'BlogCard' });
    expect(cards.length).toBeGreaterThan(0);
  });

  it('should show all posts when no tag is provided', () => {
    const wrapper = mount(BlogListPage, {
      global: { plugins: [router] },
    });

    const cards = wrapper.findAllComponents({ name: 'BlogCard' });
    expect(cards.length).toBeGreaterThan(0);
  });

  it('should apply responsive grid layout', () => {
    const wrapper = mount(BlogListPage, {
      global: { plugins: [router] },
    });

    const grid = wrapper.find('.grid');
    expect(grid.exists()).toBe(true);
  });

  it('should apply dark mode classes', () => {
    const wrapper = mount(BlogListPage, {
      global: { plugins: [router] },
    });

    const page = wrapper.find('.blog-list-page');
    expect(page.classes()).toContain('dark:bg-gray-900');
  });
});
