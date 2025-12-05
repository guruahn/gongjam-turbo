import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { config } from 'dotenv';
import { generateSitemapString } from './generate-sitemap.js';

// .env 파일 로드
const envFile =
  process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env.development';
config({ path: path.resolve(process.cwd(), envFile) });

/**
 * R2 클라이언트 생성
 */
function createR2Client(): S3Client {
  const endpoint = process.env.VITE_R2_ENDPOINT;
  const accessKeyId = process.env.VITE_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.VITE_R2_SECRET_ACCESS_KEY;

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error(
      '❌ R2 credentials not found. Please check environment variables:\n' +
        '   - VITE_R2_ENDPOINT\n' +
        '   - VITE_R2_ACCESS_KEY_ID\n' +
        '   - VITE_R2_SECRET_ACCESS_KEY'
    );
  }

  return new S3Client({
    region: 'auto',
    endpoint: endpoint,
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    },
  });
}

/**
 * 사이트맵을 R2에 업로드
 */
async function uploadSitemapToR2(): Promise<void> {
  console.log('📤 Uploading sitemap to Cloudflare R2...\n');

  try {
    // 사이트맵 XML 문자열 생성
    console.log('🗺️  Generating sitemap XML...');
    const sitemapContent = await generateSitemapString();
    console.log('✅ Sitemap XML generated successfully');

    // R2 설정
    const bucketName = process.env.VITE_R2_BUCKET_NAME || 'blog';
    const r2Client = createR2Client();

    console.log(`☁️  Uploading to R2 bucket: ${bucketName}`);

    // R2에 업로드 (캐시 무효화를 위해 no-cache 설정)
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: 'sitemap.xml',
      Body: sitemapContent,
      ContentType: 'application/xml',
      CacheControl: 'no-cache, no-store, must-revalidate', // 캐시 비활성화
      Metadata: {
        'last-updated': new Date().toISOString(),
      },
    });

    await r2Client.send(command);

    console.log('✅ Sitemap uploaded successfully!');
    console.log(`🔗 R2 Path: ${bucketName}/sitemap.xml`);
    console.log(
      `📊 Size: ${Buffer.byteLength(sitemapContent, 'utf-8')} bytes\n`
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Error uploading sitemap:', error.message);

      // 상세 에러 정보 제공
      if (error.message.includes('credentials')) {
        console.error('💡 Hint: Check R2 credentials in .env file');
      } else if (error.message.includes('posts.json')) {
        console.error(
          '💡 Hint: Run "pnpm build:posts" first to generate posts.json'
        );
      }
    } else {
      console.error('❌ Unknown error:', error);
    }
    throw error;
  }
}

// 스크립트 실행
uploadSitemapToR2().catch(error => {
  console.error('❌ Sitemap upload failed:', error);
  process.exit(1);
});
