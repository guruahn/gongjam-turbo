import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ShellLayout from '../ShellLayout.vue';

describe('ShellLayout', () => {
  it('renders header with correct text', () => {
    const wrapper = mount(ShellLayout);
    expect(wrapper.find('header').text()).toContain('this is header');
  });

  it('renders slot content in body', () => {
    const wrapper = mount(ShellLayout, {
      slots: {
        default: '<div class="test-content">Test Content</div>',
      },
    });
    expect(wrapper.find('.shell-body').html()).toContain('Test Content');
  });

  it('applies correct CSS classes to layout', () => {
    const wrapper = mount(ShellLayout);
    expect(wrapper.find('.shell-layout').classes()).toContain('min-h-screen');
    expect(wrapper.find('.shell-layout').classes()).toContain('flex');
    expect(wrapper.find('.shell-layout').classes()).toContain('flex-col');
  });

  it('applies correct CSS classes to header', () => {
    const wrapper = mount(ShellLayout);
    const header = wrapper.find('.shell-header');
    expect(header.classes()).toContain('bg-blue-600');
    expect(header.classes()).toContain('text-white');
    expect(header.classes()).toContain('p-4');
  });

  it('applies correct CSS classes to body', () => {
    const wrapper = mount(ShellLayout);
    const body = wrapper.find('.shell-body');
    expect(body.classes()).toContain('flex-1');
    expect(body.classes()).toContain('container');
    expect(body.classes()).toContain('mx-auto');
    expect(body.classes()).toContain('p-4');
  });

  it('has proper HTML structure', () => {
    const wrapper = mount(ShellLayout, {
      slots: {
        default: '<div>Content</div>',
      },
    });

    // Verify header is inside shell-layout
    expect(wrapper.find('.shell-layout').find('header').exists()).toBe(true);

    // Verify main is inside shell-layout
    expect(wrapper.find('.shell-layout').find('main').exists()).toBe(true);

    // Verify slot content is inside main
    expect(wrapper.find('main').text()).toContain('Content');
  });
});
