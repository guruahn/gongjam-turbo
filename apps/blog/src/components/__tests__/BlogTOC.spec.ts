import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import BlogTOC from '../BlogTOC.vue';
import type { TableOfContentsItem } from '../../types/blog';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(public callback: IntersectionObserverCallback) {}
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
  root = null;
  rootMargin = '';
  thresholds = [];
} as any;

describe('BlogTOC', () => {
  const mockTOC: TableOfContentsItem[] = [
    { level: 2, text: 'Introduction', id: 'introduction' },
    { level: 3, text: 'Getting Started', id: 'getting-started' },
    { level: 2, text: 'Features', id: 'features' },
    { level: 3, text: 'Advanced Features', id: 'advanced-features' },
    { level: 2, text: 'Conclusion', id: 'conclusion' },
  ];

  beforeEach(() => {
    // Clean up DOM before each test
    document.body.innerHTML = '';
  });

  it('should render when TOC has items', () => {
    const wrapper = mount(BlogTOC, {
      props: { toc: mockTOC },
    });

    expect(wrapper.find('.blog-toc').exists()).toBe(true);
  });

  it('should not render when TOC is empty', () => {
    const wrapper = mount(BlogTOC, {
      props: { toc: [] },
    });

    expect(wrapper.find('.blog-toc').exists()).toBe(false);
  });

  it('should render TOC title', () => {
    const wrapper = mount(BlogTOC, {
      props: { toc: mockTOC },
    });

    expect(wrapper.text()).toContain('Table of Contents');
  });

  it('should render all TOC items', () => {
    const wrapper = mount(BlogTOC, {
      props: { toc: mockTOC },
    });

    const items = wrapper.findAll('li');
    expect(items.length).toBe(mockTOC.length);
  });

  it('should render correct item text', () => {
    const wrapper = mount(BlogTOC, {
      props: { toc: mockTOC },
    });

    mockTOC.forEach((item) => {
      expect(wrapper.text()).toContain(item.text);
    });
  });

  it('should create correct anchor links', () => {
    const wrapper = mount(BlogTOC, {
      props: { toc: mockTOC },
    });

    const links = wrapper.findAll('a');
    mockTOC.forEach((item, index) => {
      expect(links[index].attributes('href')).toBe(`#${item.id}`);
    });
  });

  it('should apply correct indentation for level 2 items', () => {
    const wrapper = mount(BlogTOC, {
      props: { toc: mockTOC },
    });

    const level2Items = wrapper.findAll('li').filter((li) => li.classes().includes('ml-0'));
    // Count level 2 items in mockTOC
    const level2Count = mockTOC.filter((item) => item.level === 2).length;
    expect(level2Items.length).toBe(level2Count);
  });

  it('should apply correct indentation for level 3 items', () => {
    const wrapper = mount(BlogTOC, {
      props: { toc: mockTOC },
    });

    const level3Items = wrapper.findAll('li').filter((li) => li.classes().includes('ml-4'));
    // Count level 3 items in mockTOC
    const level3Count = mockTOC.filter((item) => item.level === 3).length;
    expect(level3Items.length).toBe(level3Count);
  });

  it('should apply sticky positioning', () => {
    const wrapper = mount(BlogTOC, {
      props: { toc: mockTOC },
    });

    const nav = wrapper.find('nav');
    expect(nav.classes()).toContain('sticky');
    expect(nav.classes()).toContain('top-24');
  });

  it('should handle click event', async () => {
    // Mock getElementById
    const mockElement = {
      getBoundingClientRect: () => ({ top: 100, left: 0, right: 0, bottom: 0 }),
    };
    vi.spyOn(document, 'getElementById').mockReturnValue(mockElement as any);

    // Mock window.scrollTo
    const scrollToMock = vi.fn();
    window.scrollTo = scrollToMock;

    const wrapper = mount(BlogTOC, {
      props: { toc: mockTOC },
    });

    const firstLink = wrapper.find('a');
    await firstLink.trigger('click');

    expect(scrollToMock).toHaveBeenCalled();
  });

  it('should apply dark mode classes', () => {
    const wrapper = mount(BlogTOC, {
      props: { toc: mockTOC },
    });

    const title = wrapper.find('h3');
    expect(title.classes()).toContain('dark:text-white');
  });

  it('should have proper link styling', () => {
    const wrapper = mount(BlogTOC, {
      props: { toc: mockTOC },
    });

    const link = wrapper.find('a');
    expect(link.classes()).toContain('border-l-2');
    expect(link.classes()).toContain('hover:border-blue-600');
  });

  it('should render with single item', () => {
    const singleTOC: TableOfContentsItem[] = [
      { level: 2, text: 'Only Item', id: 'only-item' },
    ];

    const wrapper = mount(BlogTOC, {
      props: { toc: singleTOC },
    });

    expect(wrapper.findAll('li').length).toBe(1);
    expect(wrapper.text()).toContain('Only Item');
  });
});
