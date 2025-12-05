import fs from 'fs/promises';
import path from 'path';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
import type { BlogMetadata } from '../src/types/blog';

const POSTS_JSON = path.resolve(process.cwd(), 'src/generated/posts.json');
const OUTPUT_DIR = path.resolve(process.cwd(), 'public');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'sitemap.xml');

// 배포 URL (환경변수 또는 기본값)
const BASE_URL = process.env.VITE_BASE_URL || 'https://jeongwoo.in';

/**
 * 사이트맵 생성
 */
async function generateSitemap(): Promise<void> {
  console.log('🗺️  Generating sitemap...\n');

  try {
    // posts.json 읽기
    const postsContent = await fs.readFile(POSTS_JSON, 'utf-8');
    const metadata: BlogMetadata = JSON.parse(postsContent);

    console.log(`📊 Found ${metadata.totalPosts} blog post(s)\n`);

    // 사이트맵 링크 생성
    const links = [
      // 블로그 목록 페이지
      {
        url: '/blog',
        changefreq: 'daily',
        priority: 1.0,
        lastmod: metadata.lastUpdated,
      },
    ];

    // 각 블로그 글 추가
    metadata.posts.forEach((post) => {
      links.push({
        url: `/blog/${post.slug}`,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: post.frontmatter.date,
      });

      console.log(`  ✅ Added: /blog/${post.slug}`);
    });

    // 태그 페이지 추가 (선택적)
    metadata.tags.forEach((tag) => {
      links.push({
        url: `/blog/tag/${tag}`,
        changefreq: 'weekly',
        priority: 0.6,
        lastmod: metadata.lastUpdated,
      });
    });

    // 사이트맵 스트림 생성
    const stream = new SitemapStream({ hostname: BASE_URL });

    // 링크를 스트림에 추가
    const xmlString = await streamToPromise(
      Readable.from(links).pipe(stream)
    ).then((data) => data.toString());

    // public 디렉토리 생성 (없으면)
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // 기존 sitemap.xml 삭제 (중복 방지)
    try {
      await fs.unlink(OUTPUT_FILE);
    } catch {
      // 파일이 없으면 무시
    }

    // sitemap.xml 저장
    await fs.writeFile(OUTPUT_FILE, xmlString, 'utf-8');

    console.log(`\n✨ Sitemap generated successfully!`);
    console.log(`📁 Output: ${OUTPUT_FILE}`);
    console.log(`🔗 Base URL: ${BASE_URL}`);
    console.log(`📊 Total URLs: ${links.length}\n`);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    throw error;
  }
}

// 스크립트 실행
generateSitemap().catch((error) => {
  console.error('❌ Sitemap generation failed:', error);
  process.exit(1);
});
