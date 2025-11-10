import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import TagFilter from '../TagFilter.vue';

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/blog', name: 'BlogList', component: { template: '<div/>' } },
    {
      path: '/blog/tag/:tag',
      name: 'BlogTagFilter',
      component: { template: '<div/>' },
    },
  ],
});

describe('TagFilter', () => {
  const mockTags = ['vue', 'typescript', 'javascript', 'react'];

  it('should render component title', () => {
    const wrapper = mount(TagFilter, {
      props: { tags: mockTags },
      global: { plugins: [router] },
    });

    expect(wrapper.text()).toContain('Filter by Tag');
  });

  it('should render "All" tag link', () => {
    const wrapper = mount(TagFilter, {
      props: { tags: mockTags },
      global: { plugins: [router] },
    });

    const allLink = wrapper.findAll('a').find((link) => link.text() === 'All');
    expect(allLink).toBeDefined();
    expect(allLink?.attributes('href')).toBe('/blog');
  });

  it('should render all provided tags', () => {
    const wrapper = mount(TagFilter, {
      props: { tags: mockTags },
      global: { plugins: [router] },
    });

    mockTags.forEach((tag) => {
      expect(wrapper.text()).toContain(`#${tag}`);
    });
  });

  it('should create correct tag links', () => {
    const wrapper = mount(TagFilter, {
      props: { tags: mockTags },
      global: { plugins: [router] },
    });

    const links = wrapper.findAll('a');
    const vueLink = links.find((link) => link.text().includes('#vue'));
    expect(vueLink?.attributes('href')).toBe('/blog/tag/vue');
  });

  it('should highlight "All" when no tag is selected', () => {
    const wrapper = mount(TagFilter, {
      props: { tags: mockTags },
      global: { plugins: [router] },
    });

    const allLink = wrapper.findAll('a').find((link) => link.text() === 'All');
    expect(allLink?.classes()).toContain('bg-blue-600');
  });

  it('should highlight selected tag', () => {
    const wrapper = mount(TagFilter, {
      props: { tags: mockTags, selectedTag: 'vue' },
      global: { plugins: [router] },
    });

    const vueLink = wrapper.findAll('a').find((link) => link.text().includes('#vue'));
    expect(vueLink?.classes()).toContain('bg-blue-600');
  });

  it('should not highlight unselected tags', () => {
    const wrapper = mount(TagFilter, {
      props: { tags: mockTags, selectedTag: 'vue' },
      global: { plugins: [router] },
    });

    const tsLink = wrapper
      .findAll('a')
      .find((link) => link.text().includes('#typescript'));
    expect(tsLink?.classes()).toContain('bg-gray-200');
  });

  it('should apply dark mode classes', () => {
    const wrapper = mount(TagFilter, {
      props: { tags: mockTags },
      global: { plugins: [router] },
    });

    const heading = wrapper.find('h3');
    expect(heading.classes()).toContain('dark:text-white');
  });

  it('should render empty when no tags provided', () => {
    const wrapper = mount(TagFilter, {
      props: { tags: [] },
      global: { plugins: [router] },
    });

    // Should still show "All" link
    const allLink = wrapper.findAll('a').find((link) => link.text() === 'All');
    expect(allLink).toBeDefined();

    // No tag links
    const tagLinks = wrapper.findAll('a').filter((link) => link.text().includes('#'));
    expect(tagLinks.length).toBe(0);
  });
});
