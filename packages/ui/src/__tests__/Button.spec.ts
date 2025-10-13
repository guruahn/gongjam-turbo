import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Button from '../Button.vue';

describe('Button.vue', () => {
  it('renders slot content correctly', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Click me',
      },
    });

    expect(wrapper.text()).toBe('Click me');
  });

  it('has default type as button', () => {
    const wrapper = mount(Button);
    const button = wrapper.find('button');

    expect(button.attributes('type')).toBe('button');
  });

  it('applies type prop correctly', () => {
    const wrapper = mount(Button, {
      props: {
        type: 'submit',
      },
    });
    const button = wrapper.find('button');

    expect(button.attributes('type')).toBe('submit');
  });

  it('emits click event when clicked', async () => {
    const wrapper = mount(Button);
    const button = wrapper.find('button');

    await button.trigger('click');

    expect(wrapper.emitted('click')).toBeTruthy();
    expect(wrapper.emitted('click')?.length).toBe(1);
  });

  it('passes MouseEvent to click handler', async () => {
    const wrapper = mount(Button);
    const button = wrapper.find('button');

    await button.trigger('click');

    const emittedEvent = wrapper.emitted('click');
    expect(emittedEvent).toBeTruthy();
    if (emittedEvent && emittedEvent[0]) {
      expect(emittedEvent[0][0]).toBeInstanceOf(MouseEvent);
    }
  });

  it('applies correct CSS classes', () => {
    const wrapper = mount(Button);
    const button = wrapper.find('button');

    expect(button.classes()).toContain('bg-blue-500');
    expect(button.classes()).toContain('text-white');
    expect(button.classes()).toContain('rounded');
  });
});
