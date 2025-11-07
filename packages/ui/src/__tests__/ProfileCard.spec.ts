import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ProfileCard from '../ProfileCard.vue';

describe('ProfileCard', () => {
  it('renders profile name', () => {
    const wrapper = mount(ProfileCard);
    expect(wrapper.text()).toContain('Jeongwoo Ahn');
  });

  it('renders profile title', () => {
    const wrapper = mount(ProfileCard);
    expect(wrapper.text()).toContain('Full Stack Developer');
  });

  it('has sticky positioning classes', () => {
    const wrapper = mount(ProfileCard);
    const profileCard = wrapper.find('.profile-card');
    expect(profileCard.classes()).toContain('sticky');
    expect(profileCard.classes()).toContain('top-20');
  });

  it('has background and shadow classes', () => {
    const wrapper = mount(ProfileCard);
    const profileCard = wrapper.find('.profile-card');
    expect(profileCard.classes()).toContain('bg-white');
    expect(profileCard.classes()).toContain('dark:bg-gray-800');
    expect(profileCard.classes()).toContain('shadow-lg');
  });

  it('renders contact information', () => {
    const wrapper = mount(ProfileCard);
    expect(wrapper.text()).toContain('guruahn@gmail.com');
    expect(wrapper.text()).toContain('Seoul, South Korea');
    expect(wrapper.text()).toContain('github.com/guruahn');
  });

  it('has hidden contact info on mobile (hidden lg:block)', () => {
    const wrapper = mount(ProfileCard);
    const contactInfo = wrapper.find('.contact-info');
    expect(contactInfo.classes()).toContain('hidden');
    expect(contactInfo.classes()).toContain('lg:block');
  });
});
