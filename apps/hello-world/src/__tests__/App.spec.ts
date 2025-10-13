import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import App from '../App.vue';
import { Button } from '@gongjam/ui';

describe('App.vue', () => {
  let alertSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  it('renders Hello World heading', () => {
    const wrapper = mount(App);

    expect(wrapper.find('h1').text()).toBe('Hello World');
  });

  it('renders Button component', () => {
    const wrapper = mount(App);

    expect(wrapper.findComponent(Button).exists()).toBe(true);
  });

  it('Button has correct text', () => {
    const wrapper = mount(App);
    const button = wrapper.findComponent(Button);

    expect(button.text()).toBe('Click Me');
  });

  it('shows alert when button is clicked', async () => {
    const wrapper = mount(App);
    const button = wrapper.findComponent(Button);

    await button.trigger('click');

    expect(alertSpy).toHaveBeenCalledTimes(1);
    expect(alertSpy).toHaveBeenCalledWith('Button clicked!');
  });

  it('has correct layout structure', () => {
    const wrapper = mount(App);

    const mainDiv = wrapper.find('.min-h-screen');
    expect(mainDiv.exists()).toBe(true);
    expect(mainDiv.classes()).toContain('flex');
    expect(mainDiv.classes()).toContain('items-center');
    expect(mainDiv.classes()).toContain('justify-center');
  });
});
