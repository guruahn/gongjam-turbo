import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync } from 'fs';
import { basename, extname } from 'path';
import { config } from 'dotenv';

// .env 파일 로드
config();

interface UploadOptions {
  filePath: string;
  key?: string;
  contentType?: string;
}

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

// Cloudflare R2 클라이언트 초기화
const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

/**
 * 파일을 Cloudflare R2에 업로드
 * @param options - 업로드 옵션
 * @returns 업로드 결과 (성공 여부 및 공개 URL)
 */
export async function uploadToR2(
  options: UploadOptions
): Promise<UploadResult> {
  try {
    // 환경변수 검증
    if (!process.env.R2_ENDPOINT) {
      throw new Error('R2_ENDPOINT 환경변수가 설정되지 않았습니다.');
    }
    if (!process.env.R2_ACCESS_KEY_ID) {
      throw new Error('R2_ACCESS_KEY_ID 환경변수가 설정되지 않았습니다.');
    }
    if (!process.env.R2_SECRET_ACCESS_KEY) {
      throw new Error('R2_SECRET_ACCESS_KEY 환경변수가 설정되지 않았습니다.');
    }
    if (!process.env.R2_BUCKET_NAME) {
      throw new Error('R2_BUCKET_NAME 환경변수가 설정되지 않았습니다.');
    }
    if (!process.env.R2_PUBLIC_URL) {
      throw new Error('R2_PUBLIC_URL 환경변수가 설정되지 않았습니다.');
    }

    // 파일 읽기
    const fileContent = readFileSync(options.filePath);

    // 파일명 및 Content-Type 설정
    const fileName = options.key || basename(options.filePath);
    const extension = extname(fileName).toLowerCase();

    let contentType = options.contentType;
    if (!contentType) {
      // 확장자에 따른 Content-Type 자동 설정
      const contentTypeMap: Record<string, string> = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
      };
      contentType = contentTypeMap[extension] || 'application/octet-stream';
    }

    // R2에 업로드 (blog/ 경로 아래)
    const key = `blog/${fileName}`;

    console.log(`📤 업로드 시작: ${fileName}`);
    console.log(`   경로: ${key}`);
    console.log(`   Content-Type: ${contentType}`);

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: fileContent,
      ContentType: contentType,
    });

    await s3Client.send(command);

    // 공개 URL 생성
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

    console.log(`✅ 업로드 성공!`);
    console.log(`   URL: ${publicUrl}`);

    return {
      success: true,
      url: publicUrl,
    };
  } catch (error) {
    console.error('❌ R2 업로드 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// CLI 실행 (ES Module)
const isMainModule = import.meta.url === `file://${process.argv[1]}`;

if (isMainModule) {
  const filePath = process.argv[2];
  const customKey = process.argv[3]; // 선택적: 커스텀 파일명

  if (!filePath) {
    console.error('❌ 사용법: pnpm upload:image <file-path> [custom-key]');
    console.error('   예시: pnpm upload:image ./image.png blog-20251110-slug-thumbnail.png');
    process.exit(1);
  }

  uploadToR2({ filePath, key: customKey })
    .then((result) => {
      if (result.success) {
        console.log('\n🎉 이미지가 성공적으로 업로드되었습니다!');
        console.log('📋 마크다운에 삽입:');
        console.log(`   ![이미지](${result.url})`);
      } else {
        console.error(`\n💥 업로드 실패: ${result.error}`);
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('💥 예상치 못한 오류:', error);
      process.exit(1);
    });
}
