import MarkdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItAttrs from 'markdown-it-attrs';
import { getHighlighter, type Highlighter } from 'shiki';

let highlighterInstance: Highlighter | null = null;

/**
 * Shiki Highlighter 초기화 (싱글톤)
 */
async function getHighlighterInstance(): Promise<Highlighter> {
  if (!highlighterInstance) {
    highlighterInstance = await getHighlighter({
      themes: ['github-dark', 'github-light'],
      langs: [
        'typescript',
        'javascript',
        'vue',
        'json',
        'bash',
        'css',
        'html',
        'markdown',
        'yaml',
      ],
    });
  }
  return highlighterInstance;
}

/**
 * markdown-it 인스턴스 생성 (Shiki 코드 하이라이팅 포함)
 */
export async function createMarkdownRenderer(): Promise<MarkdownIt> {
  const highlighter = await getHighlighterInstance();

  const md: MarkdownIt = new MarkdownIt({
    html: true, // HTML 태그 허용
    linkify: true, // URL 자동 링크
    typographer: true, // 타이포그래피 개선
    highlight: (code: string, lang: string): string => {
      if (!lang) {
        return `<pre><code>${md.utils.escapeHtml(code)}</code></pre>`;
      }

      try {
        // 다크모드와 라이트모드 모두 지원
        const darkHtml = highlighter.codeToHtml(code, {
          lang,
          theme: 'github-dark',
        });
        const lightHtml = highlighter.codeToHtml(code, {
          lang,
          theme: 'github-light',
        });

        // 다크모드 클래스로 구분
        return `
          <div class="shiki-container">
            <div class="shiki-light hidden dark:hidden">${lightHtml}</div>
            <div class="shiki-dark hidden dark:block">${darkHtml}</div>
          </div>
        `;
      } catch (error) {
        console.error(`Failed to highlight code for lang: ${lang}`, error);
        return `<pre><code class="language-${lang}">${md.utils.escapeHtml(
          code
        )}</code></pre>`;
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
