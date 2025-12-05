import MarkdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItAttrs from 'markdown-it-attrs';
import Prism from 'prismjs';

// Prism 언어 로드
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup'; // HTML
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-yaml';

/**
 * markdown-it 인스턴스 생성 (Prism 코드 하이라이팅 포함)
 */
export async function createMarkdownRenderer(): Promise<MarkdownIt> {
  const md: MarkdownIt = new MarkdownIt({
    html: true, // HTML 태그 허용
    linkify: true, // URL 자동 링크
    typographer: true, // 타이포그래피 개선
    highlight: (code: string, lang: string): string => {
      if (!lang) {
        return `<pre><code>${md.utils.escapeHtml(code)}</code></pre>`;
      }

      try {
        // Prism으로 하이라이팅
        const grammar = Prism.languages[lang];
        if (grammar) {
          const highlighted = Prism.highlight(code, grammar, lang);
          return `<pre class="language-${lang}"><code class="language-${lang}">${highlighted}</code></pre>`;
        }
        return `<pre class="language-${lang}"><code class="language-${lang}">${md.utils.escapeHtml(code)}</code></pre>`;
      } catch (error) {
        console.error(`Failed to highlight code for lang: ${lang}`, error);
        return `<pre class="language-${lang}"><code class="language-${lang}">${md.utils.escapeHtml(code)}</code></pre>`;
      }
    },
  });

  // 플러그인 추가
  md.use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.headerLink({
      safariReaderFix: true,
    }),
  });

  md.use(markdownItAttrs, {
    leftDelimiter: '{',
    rightDelimiter: '}',
    allowedAttributes: ['class', 'id'],
  });

  return md;
}

/**
 * 마크다운 텍스트를 HTML로 렌더링
 */
export async function renderMarkdown(content: string): Promise<string> {
  const md = await createMarkdownRenderer();
  return md.render(content);
}
