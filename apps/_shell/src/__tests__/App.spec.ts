import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import App from '../App.vue';
import routes from '../router';

// Mock ShellLayout component
vi.mock('@gongjam/ui', () => ({
  ShellLayout: {
    name: 'ShellLayout',
    template: '<div class="shell-layout"><slot /></div>',
  },
}));

describe('App', () => {
  it('renders ShellLayout component', () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes,
    });

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.find('.shell-layout').exists()).toBe(true);
  });

  it('integrates with Vue Router', () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes,
    });

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    });

    // RouterView component is present (renders as comment or element)
    expect(wrapper.findComponent({ name: 'RouterView' }).exists()).toBe(true);
  });
});
