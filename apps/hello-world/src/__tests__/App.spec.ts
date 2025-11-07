import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import App from '../App.vue';

describe('App.vue', () => {
  it('renders greeting section with title', () => {
    const wrapper = mount(App);
    expect(wrapper.text()).toContain('👋 Hola, Good Day!');
  });

  it('renders greeting section with description', () => {
    const wrapper = mount(App);
    expect(wrapper.text()).toContain("I'm a passionate full-stack developer");
  });

  it('renders tech stack section title', () => {
    const wrapper = mount(App);
    expect(wrapper.text()).toContain('🛠️ Tech Stack');
  });

  it('renders frontend tech stack', () => {
    const wrapper = mount(App);
    expect(wrapper.text()).toContain('Frontend');
    expect(wrapper.text()).toContain('Vue');
    expect(wrapper.text()).toContain('React');
    expect(wrapper.text()).toContain('TypeScript');
  });

  it('renders backend tech stack', () => {
    const wrapper = mount(App);
    expect(wrapper.text()).toContain('Backend');
    expect(wrapper.text()).toContain('Node.js');
    expect(wrapper.text()).toContain('Python');
    expect(wrapper.text()).toContain('PostgreSQL');
  });

  it('renders portfolio timeline section title', () => {
    const wrapper = mount(App);
    expect(wrapper.text()).toContain('💼 Experience & Portfolio');
  });

  it('renders portfolio items', () => {
    const wrapper = mount(App);
    expect(wrapper.text()).toContain('Senior Software Engineer at Tech Company');
    expect(wrapper.text()).toContain('Full Stack Developer at Startup');
    expect(wrapper.text()).toContain('Open Source Contributions');
    expect(wrapper.text()).toContain('Computer Science Degree');
  });

  it('has correct content container class', () => {
    const wrapper = mount(App);
    const container = wrapper.find('.hello-content');
    expect(container.exists()).toBe(true);
    expect(container.classes()).toContain('space-y-8');
  });

  it('renders sections with proper styling', () => {
    const wrapper = mount(App);
    const sections = wrapper.findAll('section');

    // Should have 3 sections: greeting, tech stack, portfolio
    expect(sections.length).toBeGreaterThanOrEqual(3);

    // Each section should have proper styling
    sections.forEach((section) => {
      expect(section.classes()).toContain('bg-white');
      expect(section.classes()).toContain('dark:bg-gray-800');
      expect(section.classes()).toContain('rounded-2xl');
      expect(section.classes()).toContain('shadow-lg');
    });
  });
});
