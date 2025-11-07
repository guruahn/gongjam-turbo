import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import ShellLayout from '../ShellLayout.vue';

describe('ShellLayout', () => {
  let router: ReturnType<typeof createRouter>;

  beforeEach(() => {
    // Create a minimal router for testing
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/hello', component: { template: '<div>Hello</div>' } },
      ],
    });
  });

  it('renders navigation bar with Jeongwoo Ahn title', async () => {
    const wrapper = mount(ShellLayout, {
      global: {
        plugins: [router],
      },
    });
    await router.isReady();

    const nav = wrapper.find('nav');
    expect(nav.text()).toContain('Jeongwoo Ahn');
  });

  it('renders 3-column grid structure', () => {
    const wrapper = mount(ShellLayout, {
      global: {
        plugins: [router],
      },
    });

    const gridContainer = wrapper.find('.grid.lg\\:grid-cols-3');
    expect(gridContainer.exists()).toBe(true);
  });

  it('renders ProfileCard in aside column', () => {
    const wrapper = mount(ShellLayout, {
      global: {
        plugins: [router],
      },
    });

    const aside = wrapper.find('aside.lg\\:col-span-1');
    expect(aside.exists()).toBe(true);
    expect(aside.find('.profile-card').exists()).toBe(true);
  });

  it('renders slot content in main column (lg:col-span-2)', () => {
    const wrapper = mount(ShellLayout, {
      slots: {
        default: '<div class="test-content">Test Content</div>',
      },
      global: {
        plugins: [router],
      },
    });

    const mainColumn = wrapper.find('.lg\\:col-span-2');
    expect(mainColumn.exists()).toBe(true);
    expect(mainColumn.html()).toContain('Test Content');
  });

  it('renders footer with GitHub link text', () => {
    const wrapper = mount(ShellLayout, {
      global: {
        plugins: [router],
      },
    });

    const footer = wrapper.find('footer');
    expect(footer.exists()).toBe(true);
    expect(footer.text()).toContain('github.com/guruahn');
  });

  it('renders footer with email link text', () => {
    const wrapper = mount(ShellLayout, {
      global: {
        plugins: [router],
      },
    });

    const footer = wrapper.find('footer');
    expect(footer.text()).toContain('guruahn@gmail.com');
  });

  it('applies correct CSS classes to layout container', () => {
    const wrapper = mount(ShellLayout, {
      global: {
        plugins: [router],
      },
    });

    const layout = wrapper.find('.shell-layout');
    expect(layout.classes()).toContain('min-h-screen');
    expect(layout.classes()).toContain('flex');
    expect(layout.classes()).toContain('flex-col');
  });

  it('has proper HTML structure with nav, main, and footer', () => {
    const wrapper = mount(ShellLayout, {
      slots: {
        default: '<div>Content</div>',
      },
      global: {
        plugins: [router],
      },
    });

    // Verify header/nav exists
    expect(wrapper.find('header').exists()).toBe(true);
    expect(wrapper.find('nav').exists()).toBe(true);

    // Verify main content area exists
    expect(wrapper.find('main.shell-body').exists()).toBe(true);

    // Verify footer exists
    expect(wrapper.find('footer.shell-footer').exists()).toBe(true);
  });
});
