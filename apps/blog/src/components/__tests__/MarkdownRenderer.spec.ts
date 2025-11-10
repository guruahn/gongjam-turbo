import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import MarkdownRenderer from '../MarkdownRenderer.vue';

describe('MarkdownRenderer', () => {
  it('should render HTML content', () => {
    const html = '<h1>Test Heading</h1><p>Test paragraph</p>';
    const wrapper = mount(MarkdownRenderer, {
      props: { html },
    });

    expect(wrapper.html()).toContain('<h1>Test Heading</h1>');
    expect(wrapper.html()).toContain('<p>Test paragraph</p>');
  });

  it('should apply prose classes', () => {
    const wrapper = mount(MarkdownRenderer, {
      props: { html: '<p>test</p>' },
    });

    const article = wrapper.find('article');
    expect(article.exists()).toBe(true);
    expect(article.classes()).toContain('prose');
    expect(article.classes()).toContain('prose-lg');
  });

  it('should apply dark mode prose classes', () => {
    const wrapper = mount(MarkdownRenderer, {
      props: { html: '<p>test</p>' },
    });

    const article = wrapper.find('article');
    expect(article.classes()).toContain('dark:prose-invert');
  });

  it('should render code blocks', () => {
    const html = '<pre><code>const x = 1;</code></pre>';
    const wrapper = mount(MarkdownRenderer, {
      props: { html },
    });

    expect(wrapper.html()).toContain('<code>const x = 1;</code>');
  });

  it('should render links', () => {
    const html = '<a href="https://example.com">Link</a>';
    const wrapper = mount(MarkdownRenderer, {
      props: { html },
    });

    const link = wrapper.find('a');
    expect(link.exists()).toBe(true);
    expect(link.attributes('href')).toBe('https://example.com');
    expect(link.text()).toBe('Link');
  });

  it('should render images', () => {
    const html = '<img src="/test.jpg" alt="Test" />';
    const wrapper = mount(MarkdownRenderer, {
      props: { html },
    });

    const img = wrapper.find('img');
    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toBe('/test.jpg');
    expect(img.attributes('alt')).toBe('Test');
  });

  it('should render blockquotes', () => {
    const html = '<blockquote><p>Quote text</p></blockquote>';
    const wrapper = mount(MarkdownRenderer, {
      props: { html },
    });

    expect(wrapper.html()).toContain('<blockquote>');
    expect(wrapper.html()).toContain('Quote text');
  });

  it('should render lists', () => {
    const html = '<ul><li>Item 1</li><li>Item 2</li></ul>';
    const wrapper = mount(MarkdownRenderer, {
      props: { html },
    });

    const ul = wrapper.find('ul');
    const li = wrapper.findAll('li');
    expect(ul.exists()).toBe(true);
    expect(li.length).toBe(2);
    expect(li[0].text()).toBe('Item 1');
    expect(li[1].text()).toBe('Item 2');
  });

  it('should render tables', () => {
    const html = `
      <table>
        <thead><tr><th>Header</th></tr></thead>
        <tbody><tr><td>Cell</td></tr></tbody>
      </table>
    `;
    const wrapper = mount(MarkdownRenderer, {
      props: { html },
    });

    expect(wrapper.find('table').exists()).toBe(true);
    expect(wrapper.find('th').text()).toBe('Header');
    expect(wrapper.find('td').text()).toBe('Cell');
  });

  it('should handle empty HTML', () => {
    const wrapper = mount(MarkdownRenderer, {
      props: { html: '' },
    });

    const article = wrapper.find('article');
    expect(article.exists()).toBe(true);
    expect(article.text()).toBe('');
  });

  it('should render complex HTML structure', () => {
    const html = `
      <h1>Title</h1>
      <p>Paragraph with <strong>bold</strong> and <code>code</code>.</p>
      <h2>Subtitle</h2>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
    `;
    const wrapper = mount(MarkdownRenderer, {
      props: { html },
    });

    expect(wrapper.find('h1').text()).toBe('Title');
    expect(wrapper.find('h2').text()).toBe('Subtitle');
    expect(wrapper.find('strong').text()).toBe('bold');
    expect(wrapper.find('code').text()).toBe('code');
    expect(wrapper.findAll('li').length).toBe(2);
  });
});
