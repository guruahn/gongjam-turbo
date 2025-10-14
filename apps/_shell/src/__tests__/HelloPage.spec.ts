import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import HelloPage from '../pages/HelloPage.vue';

// Mock the Module Federation import
vi.mock('helloWorld/App', () => ({
  default: {
    name: 'HelloWorldApp',
    template: '<div class="mocked-hello-world">Mocked Hello World</div>',
  },
}));

describe('HelloPage', () => {
  it('renders hello-page container', () => {
    const wrapper = mount(HelloPage);
    expect(wrapper.find('.hello-page').exists()).toBe(true);
  });

  it('includes Suspense component for lazy loading', () => {
    const wrapper = mount(HelloPage);
    expect(wrapper.html()).toContain('suspense');
  });

  it('loads hello-world app via Module Federation', async () => {
    const wrapper = mount(HelloPage);
    await wrapper.vm.$nextTick();

    // Wait for async component to load
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(wrapper.html()).toContain('Mocked Hello World');
  });
});
