import fs from 'fs/promises';
import path from 'path';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
import type { BlogMetadata } from '../src/types/blog';

const POSTS_JSON = path.resolve(process.cwd(), 'src/generated/posts.json');

// 배포 URL (환경변수 또는 기본값)
const BASE_URL = 'https://jeongwoo.in';

/**
 * 사이트맵 XML 문자열 생성 (파일 저장 없이)
 */
export async function generateSitemapString(): Promise<string> {
  const postsContent = await fs.readFile(POSTS_JSON, 'utf-8');
  const metadata: BlogMetadata = JSON.parse(postsContent);

  // 사이트맵 링크 생성
  const links = [
    {
      url: '/blog',
      changefreq: 'daily',
      priority: 1.0,
      lastmod: metadata.lastUpdated,
    },
    {
      url: '/guestbook',
      changefreq: 'daily',
      priority: 1.0,
      lastmod: metadata.lastUpdated,
    },
    {
      url: '/',
      changefreq: 'weekly',
      priority: 1.0,
      lastmod: metadata.lastUpdated,
    },
  ];

  metadata.posts.forEach(post => {
    links.push({
      url: `/blog/${post.slug}`,
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: post.frontmatter.date,
    });
  });

  metadata.tags.forEach(tag => {
    links.push({
      url: `/blog/tag/${tag}`,
      changefreq: 'weekly',
      priority: 0.6,
      lastmod: metadata.lastUpdated,
    });
  });

  const stream = new SitemapStream({ hostname: BASE_URL });
  const xmlString = await streamToPromise(
    Readable.from(links).pipe(stream)
  ).then(data => data.toString());

  // XML 선언 완전 제거 (R2 업로드 시 중복 방지)
  return xmlString.replace(/<\?xml version="1\.0" encoding="UTF-8"\?>\s*/g, '');
}
