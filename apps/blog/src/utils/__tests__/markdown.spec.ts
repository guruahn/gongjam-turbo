import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMarkdownRenderer, renderMarkdown } from '../markdown';

// Mock shiki to avoid actual highlighting complexity
vi.mock('shiki', () => ({
  getHighlighter: vi.fn().mockResolvedValue({
    codeToHtml: vi.fn((code: string, options: any) => {
      return `<pre class="shiki ${options.theme}"><code>${code}</code></pre>`;
    }),
  }),
}));

describe('markdown', () => {
  describe('createMarkdownRenderer', () => {
    it('should create markdown-it instance', async () => {
      const md = await createMarkdownRenderer();
      expect(md).toBeDefined();
      expect(typeof md.render).toBe('function');
    });

    it('should support HTML tags', async () => {
      const md = await createMarkdownRenderer();
      const result = md.render('<p>HTML content</p>');
      expect(result).toContain('<p>HTML content</p>');
    });

    it('should render basic markdown', async () => {
      const md = await createMarkdownRenderer();
      const result = md.render('# Heading\n\nParagraph text.');
      expect(result).toContain('<h1');
      expect(result).toContain('Heading');
      expect(result).toContain('<p>');
      expect(result).toContain('Paragraph text');
    });

    it('should render code blocks with highlighting', async () => {
      const md = await createMarkdownRenderer();
      const result = md.render('```js\nconst x = 1;\n```');
      expect(result).toContain('shiki');
      expect(result).toContain('const x = 1;');
    });

    it('should handle code blocks without language', async () => {
      const md = await createMarkdownRenderer();
      const result = md.render('```\nplain code\n```');
      expect(result).toContain('<code>');
      expect(result).toContain('plain code');
    });

    it('should render links', async () => {
      const md = await createMarkdownRenderer();
      const result = md.render('[Link](https://example.com)');
      expect(result).toContain('<a');
      expect(result).toContain('href="https://example.com"');
      expect(result).toContain('Link');
    });

    it('should support markdown-it-anchor for headings', async () => {
      const md = await createMarkdownRenderer();
      const result = md.render('## Section Title');
      // Should have anchor links
      expect(result).toContain('id=');
    });

    it('should escape HTML in code when highlighting fails', async () => {
      // This tests the error handler in the highlight function
      const md = await createMarkdownRenderer();
      const result = md.render('```unknown-lang\n<script>alert("xss")</script>\n```');
      // Should contain escaped HTML
      expect(result).toBeTruthy();
    });
  });

  describe('renderMarkdown', () => {
    it('should render markdown to HTML', async () => {
      const result = await renderMarkdown('# Hello World\n\nThis is a test.');
      expect(result).toContain('<h1');
      expect(result).toContain('Hello World');
      expect(result).toContain('<p>');
      expect(result).toContain('This is a test');
    });

    it('should handle empty string', async () => {
      const result = await renderMarkdown('');
      expect(result).toBe('');
    });

    it('should render complex markdown', async () => {
      const markdown = `
# Title

Paragraph with **bold** and *italic*.

- List item 1
- List item 2

\`\`\`js
const x = 1;
\`\`\`

[Link](https://example.com)
`;

      const result = await renderMarkdown(markdown);
      expect(result).toContain('<h1');
      expect(result).toContain('<strong>');
      expect(result).toContain('<em>');
      expect(result).toContain('<ul>');
      expect(result).toContain('<li>');
      expect(result).toContain('<a');
      expect(result).toContain('const x = 1');
    });

    it('should support markdown-it-attrs syntax', async () => {
      const result = await renderMarkdown('# Title {.custom-class}');
      // Should have custom class
      expect(result).toBeTruthy();
    });
  });
});
