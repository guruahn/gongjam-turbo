import { describe, it, expect } from 'vitest';
import { generateTOC, generateTOCFromMarkdown } from '../toc';

describe('toc', () => {
  describe('generateTOC', () => {
    it('should return empty array for empty HTML', () => {
      expect(generateTOC('')).toEqual([]);
    });

    it('should extract H2 heading with id', () => {
      const html = '<h2 id="intro">Introduction</h2>';
      const toc = generateTOC(html);
      expect(toc).toEqual([
        { level: 2, text: 'Introduction', id: 'intro' },
      ]);
    });

    it('should extract H3 heading with id', () => {
      const html = '<h3 id="detail">Detail</h3>';
      const toc = generateTOC(html);
      expect(toc).toEqual([
        { level: 3, text: 'Detail', id: 'detail' },
      ]);
    });

    it('should extract multiple headings in order', () => {
      const html = `
        <h2 id="intro">Introduction</h2>
        <h3 id="detail">Detail</h3>
        <h2 id="conclusion">Conclusion</h2>
      `;
      const toc = generateTOC(html);
      expect(toc).toEqual([
        { level: 2, text: 'Introduction', id: 'intro' },
        { level: 3, text: 'Detail', id: 'detail' },
        { level: 2, text: 'Conclusion', id: 'conclusion' },
      ]);
    });

    it('should remove HTML tags from heading text', () => {
      const html = '<h2 id="test"><strong>Bold</strong> Title</h2>';
      const toc = generateTOC(html);
      expect(toc).toEqual([
        { level: 2, text: 'Bold Title', id: 'test' },
      ]);
    });

    it('should ignore H1 headings', () => {
      const html = `
        <h1 id="main">Main Title</h1>
        <h2 id="intro">Introduction</h2>
      `;
      const toc = generateTOC(html);
      expect(toc).toEqual([
        { level: 2, text: 'Introduction', id: 'intro' },
      ]);
    });

    it('should ignore headings without id', () => {
      const html = `
        <h2>No ID Heading</h2>
        <h2 id="with-id">With ID</h2>
      `;
      const toc = generateTOC(html);
      expect(toc).toEqual([
        { level: 2, text: 'With ID', id: 'with-id' },
      ]);
    });

    it('should trim whitespace from heading text', () => {
      const html = '<h2 id="test">  Title with spaces  </h2>';
      const toc = generateTOC(html);
      expect(toc).toEqual([
        { level: 2, text: 'Title with spaces', id: 'test' },
      ]);
    });
  });

  describe('generateTOCFromMarkdown', () => {
    it('should return empty array for empty markdown', () => {
      expect(generateTOCFromMarkdown('')).toEqual([]);
    });

    it('should extract H2 heading from markdown', () => {
      const markdown = '## Introduction';
      const toc = generateTOCFromMarkdown(markdown);
      expect(toc).toEqual([
        { level: 2, text: 'Introduction', id: 'introduction' },
      ]);
    });

    it('should extract H3 heading from markdown', () => {
      const markdown = '### Detail';
      const toc = generateTOCFromMarkdown(markdown);
      expect(toc).toEqual([
        { level: 3, text: 'Detail', id: 'detail' },
      ]);
    });

    it('should extract multiple headings from markdown', () => {
      const markdown = `
## Introduction
Some text here
### Details
More text
## Conclusion
      `;
      const toc = generateTOCFromMarkdown(markdown);
      expect(toc).toEqual([
        { level: 2, text: 'Introduction', id: 'introduction' },
        { level: 3, text: 'Details', id: 'details' },
        { level: 2, text: 'Conclusion', id: 'conclusion' },
      ]);
    });

    it('should generate kebab-case IDs', () => {
      const markdown = '## Hello World Example';
      const toc = generateTOCFromMarkdown(markdown);
      expect(toc).toEqual([
        { level: 2, text: 'Hello World Example', id: 'hello-world-example' },
      ]);
    });

    it('should handle special characters in headings', () => {
      const markdown = '## My: Special! Heading?';
      const toc = generateTOCFromMarkdown(markdown);
      expect(toc[0].id).toBe('my-special-heading');
    });

    it('should ignore H1 headings', () => {
      const markdown = `
# Main Title
## Introduction
      `;
      const toc = generateTOCFromMarkdown(markdown);
      expect(toc).toEqual([
        { level: 2, text: 'Introduction', id: 'introduction' },
      ]);
    });

    it('should lowercase generated IDs', () => {
      const markdown = '## UPPERCASE TITLE';
      const toc = generateTOCFromMarkdown(markdown);
      expect(toc[0].id).toBe('uppercase-title');
    });
  });
});
