import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';
import matter from 'gray-matter';
import { renderMarkdown } from '../src/utils/markdown';
import { generateTOC } from '../src/utils/toc';
import { calculateReadingTime } from '../src/utils/readingTime';
import type {
  BlogPost,
  BlogPostFrontmatter,
  BlogMetadata,
} from '../src/types/blog';

const POSTS_DIR = path.resolve(process.cwd(), 'posts');
const OUTPUT_DIR = path.resolve(process.cwd(), 'src/generated');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'posts.json');

/**
 * 마크다운 파일 처리
 */
async function processMarkdownFile(filePath: string): Promise<BlogPost | null> {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    // Frontmatter 검증
    const frontmatter = data as BlogPostFrontmatter;

    if (!frontmatter.title || !frontmatter.date) {
      console.warn(
        `⚠️  Skipping ${filePath}: Missing required frontmatter fields`
      );
      return null;
    }

    // 초안 제외
    if (frontmatter.draft === true) {
      console.log(`📝 Skipping draft: ${frontmatter.title}`);
      return null;
    }

    // 파일명에서 slug 추출 (날짜 제거)
    const fileName = path.basename(filePath, '.md');
    const slug = fileName.replace(/^\d{4}-\d{2}-\d{2}-/, '');
    const id = slug;

    // 마크다운 → HTML 렌더링
    const html = await renderMarkdown(content);

    // 목차 생성
    const toc = generateTOC(html);

    // 읽기 시간 계산
    const readingTime = calculateReadingTime(content);

    // 기본값 설정
    if (!frontmatter.author) {
      frontmatter.author = 'Jeongwoo Ahn';
    }

    const post: BlogPost = {
      id,
      slug,
      frontmatter,
      content, // 마크다운 원본
      html, // 렌더링된 HTML
      readingTime,
      toc,
    };

    console.log(`✅ Processed: ${frontmatter.title} (${slug})`);
    return post;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error);
    return null;
  }
}

/**
 * 모든 마크다운 파일 빌드
 */
async function buildPosts(): Promise<void> {
  console.log('🚀 Building blog posts...\n');

  // posts 디렉토리에서 모든 .md 파일 찾기
  const mdFiles = await glob('**/*.md', {
    cwd: POSTS_DIR,
    absolute: true,
  });

  console.log(`📂 Found ${mdFiles.length} markdown file(s)\n`);

  // 모든 파일 처리
  const posts: BlogPost[] = [];
  for (const filePath of mdFiles) {
    const post = await processMarkdownFile(filePath);
    if (post) {
      posts.push(post);
    }
  }

  // 날짜순 정렬 (최신순)
  posts.sort((a, b) => {
    const dateA = new Date(a.frontmatter.date).getTime();
    const dateB = new Date(b.frontmatter.date).getTime();
    return dateB - dateA;
  });

  // 모든 태그 추출
  const tagsSet = new Set<string>();
  posts.forEach(post => {
    post.frontmatter.tags.forEach(tag => tagsSet.add(tag));
  });
  const tags = Array.from(tagsSet).sort();

  // 메타데이터 생성
  const metadata: BlogMetadata = {
    posts,
    tags,
    totalPosts: posts.length,
    lastUpdated: new Date().toISOString(),
  };

  // generated 디렉토리 생성
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // JSON 파일 저장
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(metadata, null, 2), 'utf-8');

  console.log(`\n✨ Build complete!`);
  console.log(`📊 Total posts: ${posts.length}`);
  console.log(`🏷️  Total tags: ${tags.length}`);
  console.log(`📁 Output: ${OUTPUT_FILE}\n`);
}

// 스크립트 실행
buildPosts().catch(error => {
  console.error('❌ Build failed:', error);
  process.exit(1);
});
