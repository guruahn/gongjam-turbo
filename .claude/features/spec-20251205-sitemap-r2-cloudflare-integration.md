# Feature Specification: Sitemap R2 Upload & Cloudflare Pages Functions Integration

**Feature Name**: sitemap-r2-cloudflare-integration
**Created**: 2025-12-05
**Status**: Draft
**Priority**: Medium
**Complexity**: Moderate

---

## 1. 기능 개요 및 목적

### 1.1 목적

CSR(Client-Side Rendering) 방식의 Vue 3 블로그 프로젝트에서 검색엔진 크롤러가 접근 가능한 사이트맵을 제공하는 인프라를 구축합니다. 생성된 사이트맵을 Cloudflare R2에 저장하고, Cloudflare Pages Functions를 통해 `https://jeongwoo.in/sitemap.xml` 경로로 제공합니다.

### 1.2 배경

- 현재 블로그는 CSR 방식으로 구현되어 있어, 정적 사이트맵이 필요합니다
- 빌드 시 자동으로 사이트맵을 생성하는 스크립트(`generate-sitemap.ts`)가 이미 존재합니다
- Module Federation 아키텍처에서 Blog 앱은 Remote로 동작하며, Shell 앱이 Host 역할을 합니다
- Shell 앱은 Cloudflare Pages에 배포되며, 도메인은 `https://jeongwoo.in/`입니다
- 검색엔진 최적화(SEO)를 위해 표준 경로에서 사이트맵을 제공해야 합니다

### 1.3 주요 이점

- 검색엔진이 블로그 콘텐츠를 효율적으로 크롤링 가능
- 빌드 프로세스에 자동 통합되어 수동 작업 불필요
- Cloudflare R2와 Pages Functions를 활용한 비용 효율적인 솔루션
- 기존 인프라(R2 버킷, Pages 프로젝트)를 재사용하여 별도 리소스 불필요

### 1.4 성공 기준

- [ ] 블로그 빌드 시 사이트맵이 자동으로 R2에 업로드됨
- [ ] `https://jeongwoo.in/sitemap.xml` 접속 시 최신 사이트맵 응답 (Status 200)
- [ ] 적절한 Content-Type 헤더 설정 (`application/xml`)
- [ ] 적절한 Cache-Control 헤더 설정 (`max-age=3600`)
- [ ] Google Search Console에서 사이트맵 검증 성공
- [ ] 에러 상황에서 적절한 HTTP 상태 코드 반환 (404, 500 등)

### 1.5 연관 문서

- 기존 스펙: `/Users/jeongwooahn/Documents/projects/gongjam-www/.claude/features/spec-20251107-blog.md`
- 프로젝트 문서: `/Users/jeongwooahn/Documents/projects/gongjam-www/.claude/CLAUDE.md`

---

## 2. 시스템 아키텍처 및 데이터 플로우

### 2.1 전체 아키텍처

```
┌──────────────────────────────────────────────────────────────────┐
│                     Build & Deploy Process                       │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│  Step 1: Blog Build Process (apps/blog)                         │
│                                                                  │
│  1. pnpm build:posts  → Generate posts.json from markdown       │
│  2. vite build        → Build blog app                          │
│  3. pnpm build:sitemap → Generate sitemap.xml                   │
│  4. pnpm upload:sitemap → Upload sitemap to R2                  │
└──────────────────────────────────────────────────────────────────┘
                              │
                              │ AWS SDK S3 API
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│              Cloudflare R2 Storage (Bucket: "blog")              │
│                                                                  │
│  📁 blog/                                                        │
│     ├── images/          (existing)                             │
│     └── sitemap.xml      (NEW)                                  │
└──────────────────────────────────────────────────────────────────┘
                              │
                              │ R2 Binding
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│  Step 2: Runtime Request Handling (apps/_shell)                 │
│                                                                  │
│  User Request: GET https://jeongwoo.in/sitemap.xml              │
│         │                                                        │
│         ▼                                                        │
│  Cloudflare Pages Functions                                     │
│  (functions/sitemap.xml.ts)                                     │
│         │                                                        │
│         ├─→ Read from R2 via binding                            │
│         ├─→ Set Content-Type: application/xml                   │
│         ├─→ Set Cache-Control: max-age=3600                     │
│         └─→ Return sitemap XML                                  │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                    Client/Search Engine                          │
│                                                                  │
│  Status: 200 OK                                                 │
│  Content-Type: application/xml                                  │
│  Cache-Control: max-age=3600                                    │
│  Body: <xml>...</xml>                                           │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 데이터 플로우 상세

#### 2.2.1 빌드 타임 플로우

```
[Markdown Files]
    → [build-posts.ts]
    → [posts.json]
    → [generate-sitemap.ts]
    → [public/sitemap.xml]
    → [upload-sitemap.ts]
    → [R2: blog/sitemap.xml]
```

1. **포스트 빌드**: 마크다운 파일들을 파싱하여 메타데이터를 `posts.json`으로 생성
2. **사이트맵 생성**: `posts.json`을 기반으로 사이트맵 XML 파일 생성 (`public/sitemap.xml`)
3. **R2 업로드**: 생성된 사이트맵을 AWS SDK를 통해 R2에 업로드

#### 2.2.2 런타임 플로우

```
[HTTP Request: /sitemap.xml]
    → [Cloudflare CDN]
    → [Pages Functions: sitemap.xml.ts]
    → [R2 Binding: BLOG_BUCKET]
    → [R2 Object: sitemap.xml]
    → [HTTP Response: XML + Headers]
```

1. **요청 수신**: Cloudflare CDN이 `/sitemap.xml` 요청을 Pages Functions로 라우팅
2. **R2 읽기**: Pages Function이 R2 바인딩을 통해 사이트맵 파일 읽기
3. **헤더 설정**: Content-Type 및 Cache-Control 헤더 설정
4. **응답 반환**: XML 콘텐츠와 함께 HTTP 200 응답 반환

### 2.3 Module Federation 통합

현재 프로젝트는 Module Federation 아키텍처를 사용하며, 다음과 같은 구조입니다:

- **Shell 앱 (Host)**: `https://jeongwoo.in/` - Pages Functions 호스팅
- **Blog 앱 (Remote)**: `https://blog.jeongwoo.in/` - 블로그 콘텐츠 제공

사이트맵은 Shell 앱의 도메인(`jeongwoo.in`)에서 제공되어야 하므로, Pages Functions는 Shell 앱에 구현됩니다.

---

## 3. 기술 요구사항

### 3.1 시스템 아키텍처

- **아키텍처 패턴**: Serverless (Cloudflare Pages Functions)
- **스토리지**: Cloudflare R2 (S3-compatible)
- **CDN**: Cloudflare CDN (Pages 기본 제공)
- **빌드 도구**: Vite 6.0.3, Turborepo
- **배포 환경**: Cloudflare Pages

### 3.2 기술 스택

#### Blog 앱 (빌드 타임)
- **런타임**: Node.js >= 18.0.0
- **언어**: TypeScript 5.6.3
- **SDK**: @aws-sdk/client-s3 ^3.699.0 (S3 호환 API)
- **환경변수 관리**: dotenv ^17.2.3
- **스크립트 실행**: tsx ^4.19.2

#### Shell 앱 (런타임)
- **플랫폼**: Cloudflare Pages Functions
- **런타임**: Cloudflare Workers Runtime (V8)
- **바인딩**: R2 Bucket Binding
- **설정**: wrangler.toml

### 3.3 외부 서비스 연동

#### Cloudflare R2
- **버킷 이름**: `blog`
- **엔드포인트**: `https://bf34de8e27727475cf0b7f8dbf6f35a5.r2.cloudflarestorage.com`
- **API**: S3-compatible REST API
- **인증**: Access Key ID + Secret Access Key
- **사용 용도**:
  - 기존: 블로그 이미지 저장 (`blog/images/`)
  - 신규: 사이트맵 파일 저장 (`sitemap.xml`)

#### Cloudflare Pages
- **프로젝트**: Shell 앱 배포
- **도메인**: `https://jeongwoo.in/`
- **Functions**: `/functions/sitemap.xml.ts`
- **R2 바인딩**: `BLOG_BUCKET` → `blog` 버킷

### 3.4 성능 요구사항

- **사이트맵 생성 시간**: < 5초 (100개 포스트 기준)
- **R2 업로드 시간**: < 3초
- **Pages Function 응답 시간**: < 100ms (콜드 스타트 제외)
- **CDN 캐시 TTL**: 1시간 (3600초)
- **R2 읽기 지연**: < 50ms

### 3.5 보안 요구사항

- **R2 Credentials**: 환경변수로 관리, 절대 코드에 하드코딩 금지
- **CORS**: 필요 시 R2 버킷 CORS 설정 (현재는 불필요)
- **공개 접근**: 사이트맵은 공개 URL이므로 인증 불필요
- **환경 분리**: Development / Production 환경변수 분리

### 3.6 파일 구조 및 모듈 구성

```
gongjam-www/
├── apps/
│   ├── blog/                              # Blog Remote 앱
│   │   ├── scripts/
│   │   │   ├── generate-sitemap.ts       # (기존) 사이트맵 생성
│   │   │   ├── upload-sitemap.ts         # (신규) R2 업로드
│   │   │   └── build-posts.ts            # (기존) 포스트 빌드
│   │   ├── .env.development              # (수정) R2 credentials 추가
│   │   ├── .env.production               # (수정) R2 credentials 추가
│   │   └── package.json                  # (수정) 스크립트 추가
│   │
│   └── _shell/                            # Shell Host 앱
│       ├── functions/
│       │   └── sitemap.xml.ts            # (신규) Pages Function
│       ├── wrangler.toml                 # (수정) R2 바인딩 추가
│       └── package.json                  # (필요시) 타입 정의 추가
│
├── scripts/
│   └── upload-to-r2.ts                   # (기존) 참조용 이미지 업로드
│
└── package.json                           # (루트) 필요시 스크립트 추가
```

### 3.7 라우터 구성

Pages Functions는 파일 기반 라우팅을 사용합니다:

- **파일 경로**: `apps/_shell/functions/sitemap.xml.ts`
- **URL 경로**: `https://jeongwoo.in/sitemap.xml`
- **HTTP 메서드**: GET (기본)

### 3.8 상태 관리 방식

상태 관리는 불필요합니다 (Stateless Function):
- Pages Function은 순수 함수로 동작
- R2에서 읽은 데이터를 즉시 반환
- 세션 또는 상태 저장 없음

### 3.9 로깅 및 모니터링

- **빌드 로그**: `console.log`를 통한 빌드 프로세스 추적
- **업로드 로그**: 성공/실패 메시지, R2 키, 파일 크기 등
- **Function 로그**: Cloudflare Pages 대시보드에서 실시간 로그 확인
- **에러 추적**: Pages Function 에러 스택 트레이스

### 3.10 스타일 시트 적용방식

UI가 없으므로 스타일 시트는 적용되지 않습니다.

### 3.11 빌드 도구 및 방식

- **Blog 앱 빌드**: Vite 6.0.3
- **빌드 순서**:
  1. `pnpm build:posts` (포스트 메타데이터 생성)
  2. `vite build` (앱 빌드)
  3. `pnpm build:sitemap` (사이트맵 생성)
  4. `pnpm upload:sitemap` (R2 업로드)
- **Turborepo 통합**: `turbo run build` 실행 시 자동 실행
- **병렬 빌드**: Turborepo 캐싱 및 병렬 실행 활용

---

## 4. 파일별 구현 상세

### 4.1 `apps/blog/scripts/upload-sitemap.ts` (신규)

#### 4.1.1 목적
생성된 `public/sitemap.xml` 파일을 Cloudflare R2에 업로드합니다.

#### 4.1.2 주요 기능
- 환경변수에서 R2 credentials 로드
- AWS SDK v3 (S3Client)를 사용하여 R2에 업로드
- 업로드 성공/실패 로깅
- 에러 핸들링 및 적절한 exit code 반환

#### 4.1.3 구현 예시

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { config } from 'dotenv';

// 환경변수 로드
config();

interface UploadResult {
  success: boolean;
  error?: string;
}

/**
 * 사이트맵을 Cloudflare R2에 업로드
 */
async function uploadSitemapToR2(): Promise<UploadResult> {
  try {
    // 환경변수 검증
    const requiredEnvVars = [
      'VITE_R2_ENDPOINT',
      'VITE_R2_ACCESS_KEY_ID',
      'VITE_R2_SECRET_ACCESS_KEY',
      'VITE_R2_BUCKET_NAME',
    ];

    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        throw new Error(`${envVar} 환경변수가 설정되지 않았습니다.`);
      }
    }

    console.log('🗺️  Uploading sitemap to R2...\n');

    // R2 클라이언트 초기화
    const s3Client = new S3Client({
      region: 'auto',
      endpoint: process.env.VITE_R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.VITE_R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.VITE_R2_SECRET_ACCESS_KEY!,
      },
    });

    // 사이트맵 파일 읽기
    const sitemapPath = resolve(process.cwd(), 'public/sitemap.xml');
    const sitemapContent = readFileSync(sitemapPath, 'utf-8');
    const fileSize = Buffer.byteLength(sitemapContent, 'utf-8');

    console.log(`📁 Reading sitemap from: ${sitemapPath}`);
    console.log(`📊 File size: ${(fileSize / 1024).toFixed(2)} KB\n`);

    // R2에 업로드
    const command = new PutObjectCommand({
      Bucket: process.env.VITE_R2_BUCKET_NAME,
      Key: 'sitemap.xml',
      Body: sitemapContent,
      ContentType: 'application/xml',
      CacheControl: 'public, max-age=3600',
    });

    await s3Client.send(command);

    console.log('✅ Sitemap uploaded successfully!');
    console.log(`🔗 R2 Key: sitemap.xml`);
    console.log(`📦 Bucket: ${process.env.VITE_R2_BUCKET_NAME}\n`);

    return { success: true };
  } catch (error) {
    console.error('❌ Failed to upload sitemap to R2:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// 스크립트 실행
uploadSitemapToR2()
  .then((result) => {
    if (result.success) {
      console.log('🎉 Sitemap upload completed!\n');
      process.exit(0);
    } else {
      console.error(`💥 Upload failed: ${result.error}\n`);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });
```

#### 4.1.4 에러 처리
- 환경변수 누락: 명확한 에러 메시지와 함께 종료
- 파일 읽기 실패: 파일 경로 검증 및 에러 로깅
- R2 업로드 실패: AWS SDK 에러 메시지 출력
- 모든 에러는 `process.exit(1)`로 빌드 실패 처리

#### 4.1.5 의존성
- `@aws-sdk/client-s3`: S3 호환 API 클라이언트
- `dotenv`: 환경변수 로드
- `fs`, `path`: Node.js 내장 모듈

---

### 4.2 `apps/_shell/functions/sitemap.xml.ts` (신규)

#### 4.2.1 목적
Cloudflare Pages Functions를 통해 R2에 저장된 사이트맵을 제공합니다.

#### 4.2.2 주요 기능
- R2 바인딩을 통해 `sitemap.xml` 파일 읽기
- 적절한 HTTP 헤더 설정
- 에러 상황 처리 (404, 500)

#### 4.2.3 구현 예시

```typescript
/**
 * Cloudflare Pages Function: Sitemap XML Provider
 *
 * URL: https://jeongwoo.in/sitemap.xml
 * Method: GET
 *
 * R2에 저장된 사이트맵을 읽어서 반환합니다.
 */

interface Env {
  BLOG_BUCKET: R2Bucket;
}

export async function onRequestGet(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  try {
    console.log('[Sitemap Function] Request received');

    // R2에서 사이트맵 읽기
    const object = await context.env.BLOG_BUCKET.get('sitemap.xml');

    if (!object) {
      console.error('[Sitemap Function] Sitemap not found in R2');
      return new Response('Sitemap not found', {
        status: 404,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }

    // R2 객체를 텍스트로 변환
    const sitemapContent = await object.text();

    console.log(
      `[Sitemap Function] Sitemap served successfully (${sitemapContent.length} bytes)`
    );

    // XML 응답 반환
    return new Response(sitemapContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // 1시간 캐싱
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('[Sitemap Function] Error:', error);

    return new Response('Internal Server Error', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}
```

#### 4.2.4 에러 처리
- **404 Not Found**: R2에 파일이 없는 경우
- **500 Internal Server Error**: R2 읽기 실패 또는 예상치 못한 에러
- **로깅**: Cloudflare Pages 대시보드에서 로그 확인 가능

#### 4.2.5 캐싱 전략
- **CDN 캐싱**: `Cache-Control: public, max-age=3600` (1시간)
- **빌드 시 갱신**: 새 빌드 시 R2 파일이 업데이트되므로, 최대 1시간 후 최신 사이트맵 제공
- **캐시 무효화**: Cloudflare 대시보드에서 수동 무효화 가능

#### 4.2.6 보안 헤더
- `X-Content-Type-Options: nosniff`: MIME 타입 스니핑 방지

---

### 4.3 `apps/_shell/wrangler.toml` (수정)

#### 4.3.1 목적
Cloudflare Pages 프로젝트에 R2 바인딩을 추가합니다.

#### 4.3.2 구현 예시

```toml
# Cloudflare Pages configuration for Shell app

name = "shell"
compatibility_date = "2024-01-01"

# Pages configuration
pages_build_output_dir = "dist"

[build]
command = "pnpm build"
cwd = ""

[build.upload]
format = "directory"
dir = "dist"

# R2 Bucket Binding for Sitemap
[[r2_buckets]]
binding = "BLOG_BUCKET"
bucket_name = "blog"
preview_bucket_name = "blog"  # Development와 동일한 버킷 사용

# Environment variables (if needed)
[vars]
# Add your environment variables here
```

#### 4.3.3 바인딩 설명
- **binding**: Pages Function에서 접근할 변수명 (`BLOG_BUCKET`)
- **bucket_name**: Production 환경의 R2 버킷 이름 (`blog`)
- **preview_bucket_name**: Preview 배포 시 사용할 버킷 (동일하게 `blog` 사용)

#### 4.3.4 배포 후 추가 작업
Cloudflare Pages 대시보드에서 R2 바인딩을 수동으로 설정해야 할 수 있습니다:
1. Pages 프로젝트 > Settings > Functions
2. R2 bucket bindings 섹션
3. Add binding: `BLOG_BUCKET` → `blog`

---

### 4.4 `apps/blog/.env.development` (수정)

#### 4.4.1 기존 내용
```
VITE_BASE_URL=http://localhost:3002
```

#### 4.4.2 수정 후
```
VITE_BASE_URL=http://localhost:3002
VITE_R2_ENDPOINT=https://bf34de8e27727475cf0b7f8dbf6f35a5.r2.cloudflarestorage.com
VITE_R2_ACCESS_KEY_ID=a62a14a6f2aa4febfcc635fbc7ac01d4
VITE_R2_SECRET_ACCESS_KEY=4b79cfaa8d1e29cb61a3867ab0507568dcb44e44929fe66fa810bb1af30265fa
VITE_R2_BUCKET_NAME=blog
```

---

### 4.5 `apps/blog/.env.production` (수정)

#### 4.5.1 기존 내용
```
VITE_BASE_URL=https://blog.jeongwoo.in
```

#### 4.5.2 수정 후
```
VITE_BASE_URL=https://blog.jeongwoo.in
VITE_R2_ENDPOINT=https://bf34de8e27727475cf0b7f8dbf6f35a5.r2.cloudflarestorage.com
VITE_R2_ACCESS_KEY_ID=a62a14a6f2aa4febfcc635fbc7ac01d4
VITE_R2_SECRET_ACCESS_KEY=4b79cfaa8d1e29cb61a3867ab0507568dcb44e44929fe66fa810bb1af30265fa
VITE_R2_BUCKET_NAME=blog
```

---

### 4.6 `apps/blog/package.json` (수정)

#### 4.6.1 기존 스크립트 섹션
```json
{
  "scripts": {
    "dev": "vite",
    "build": "pnpm build:posts && vite build && pnpm build:sitemap",
    "build:posts": "tsx scripts/build-posts.ts",
    "build:sitemap": "tsx scripts/generate-sitemap.ts",
    "preview": "vite preview",
    "lint": "eslint .",
    "type-check": "vue-tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

#### 4.6.2 수정 후
```json
{
  "scripts": {
    "dev": "vite",
    "build": "pnpm build:posts && vite build && pnpm build:sitemap && pnpm upload:sitemap",
    "build:posts": "tsx scripts/build-posts.ts",
    "build:sitemap": "tsx scripts/generate-sitemap.ts",
    "upload:sitemap": "tsx scripts/upload-sitemap.ts",
    "preview": "vite preview",
    "lint": "eslint .",
    "type-check": "vue-tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

#### 4.6.3 변경 사항
- **신규 스크립트**: `upload:sitemap` - 사이트맵을 R2에 업로드
- **build 스크립트 수정**: 마지막에 `pnpm upload:sitemap` 추가하여 빌드 시 자동 업로드

---

## 5. 환경변수 및 설정

### 5.1 환경변수 목록

#### Blog 앱 (빌드 타임)
| 변수명 | 용도 | Development | Production |
|--------|------|-------------|-----------|
| `VITE_BASE_URL` | 사이트맵 기본 URL | `http://localhost:3002` | `https://blog.jeongwoo.in` |
| `VITE_R2_ENDPOINT` | R2 엔드포인트 | `https://bf34de8e27727475cf0b7f8dbf6f35a5.r2.cloudflarestorage.com` | 동일 |
| `VITE_R2_ACCESS_KEY_ID` | R2 Access Key | (개발용 키) | (프로덕션 키) |
| `VITE_R2_SECRET_ACCESS_KEY` | R2 Secret Key | (개발용 시크릿) | (프로덕션 시크릿) |
| `VITE_R2_BUCKET_NAME` | R2 버킷 이름 | `blog` | `blog` |

#### Shell 앱 (런타임)
| 바인딩명 | 타입 | 용도 |
|---------|------|------|
| `BLOG_BUCKET` | R2Bucket | 사이트맵 읽기 |

### 5.2 환경별 설정

#### Development
- **빌드 환경**: 로컬 머신
- **R2 버킷**: Production과 동일 (`blog`)
- **사이트맵 URL**: 로컬에서는 테스트 불가 (배포 후에만 접근 가능)

#### Production
- **빌드 환경**: Cloudflare Pages Build
- **R2 버킷**: `blog`
- **사이트맵 URL**: `https://jeongwoo.in/sitemap.xml`

### 5.3 보안 고려사항

- **Credentials 관리**: R2 Access Key와 Secret Key는 민감한 정보이므로 `.env` 파일에만 저장하고, `.gitignore`에 등록되어 있는지 확인
- **버전 관리 제외**: `.env.development` 및 `.env.production` 파일이 Git에 커밋되지 않도록 확인
- **최소 권한 원칙**: R2 Access Key는 `blog` 버킷에 대한 읽기/쓰기 권한만 부여

---

## 6. 빌드 및 배포 프로세스

### 6.1 로컬 개발 환경

#### 6.1.1 블로그 앱 빌드 및 업로드 테스트

```bash
# 1. Blog 앱 디렉토리로 이동
cd apps/blog

# 2. 환경변수 로드 (.env.development)
# (자동으로 로드됨)

# 3. 포스트 빌드
pnpm build:posts

# 4. 사이트맵 생성
pnpm build:sitemap

# 5. R2 업로드 테스트
pnpm upload:sitemap
```

**예상 출력**:
```
🗺️  Uploading sitemap to R2...

📁 Reading sitemap from: /path/to/public/sitemap.xml
📊 File size: 2.45 KB

✅ Sitemap uploaded successfully!
🔗 R2 Key: sitemap.xml
📦 Bucket: blog

🎉 Sitemap upload completed!
```

#### 6.1.2 전체 빌드

```bash
# 루트 디렉토리에서
pnpm --filter blog build
```

이 명령은 다음 순서로 실행됩니다:
1. `pnpm build:posts`
2. `vite build`
3. `pnpm build:sitemap`
4. `pnpm upload:sitemap`

### 6.2 Production 배포

#### 6.2.1 Blog 앱 배포

```bash
# 1. Production 환경변수 사용
NODE_ENV=production pnpm --filter blog build

# 2. Cloudflare Pages에 배포 (자동 또는 수동)
# Blog 앱의 빌드 결과물은 https://blog.jeongwoo.in에 배포됨
```

#### 6.2.2 Shell 앱 배포

```bash
# 1. Shell 앱 빌드
pnpm --filter _shell build

# 2. Cloudflare Pages에 배포
# functions/ 디렉토리도 함께 배포됨
```

#### 6.2.3 R2 바인딩 설정 (첫 배포 시)

Cloudflare Pages 대시보드에서:
1. Shell 프로젝트 > Settings > Functions
2. R2 bucket bindings 섹션에서 Add binding
3. Variable name: `BLOG_BUCKET`
4. R2 bucket: `blog`
5. Save

### 6.3 배포 검증

```bash
# 1. 사이트맵 접근 테스트
curl -I https://jeongwoo.in/sitemap.xml

# 예상 응답:
# HTTP/2 200
# content-type: application/xml; charset=utf-8
# cache-control: public, max-age=3600
# ...

# 2. 사이트맵 내용 확인
curl https://jeongwoo.in/sitemap.xml
```

### 6.4 CI/CD 통합 (선택사항)

현재 프로젝트는 Cloudflare Pages의 자동 배포를 사용하므로, Git push 시 자동으로 빌드 및 배포가 진행됩니다.

**빌드 명령**:
- Blog 앱: `pnpm --filter blog build`
- Shell 앱: `pnpm --filter _shell build`

**배포 순서**:
1. Blog 앱 빌드 → 사이트맵 R2 업로드
2. Shell 앱 빌드 → Pages Function 배포
3. 사이트맵 URL 테스트

---

## 7. 테스트 전략

### 7.1 단위 테스트 (Unit Tests)

#### 7.1.1 `upload-sitemap.ts` 테스트

**테스트 케이스**:
- [ ] 환경변수 누락 시 에러 발생
- [ ] 파일이 없을 때 에러 발생
- [ ] R2 업로드 성공 시 성공 메시지 반환
- [ ] R2 업로드 실패 시 에러 메시지 반환

**테스트 방법**: Vitest + Mocking (AWS SDK mock)

**구현 예시**:
```typescript
// apps/blog/scripts/__tests__/upload-sitemap.spec.ts
import { describe, it, expect, vi } from 'vitest';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Mock AWS SDK
vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: vi.fn(),
  PutObjectCommand: vi.fn(),
}));

describe('upload-sitemap', () => {
  it('should throw error if environment variables are missing', () => {
    // Test implementation
  });

  it('should upload sitemap successfully', async () => {
    // Test implementation
  });
});
```

#### 7.1.2 `sitemap.xml.ts` (Pages Function) 테스트

Pages Functions는 Cloudflare Workers 환경에서 실행되므로, 로컬 단위 테스트는 제한적입니다. 대신 통합 테스트를 권장합니다.

### 7.2 통합 테스트 (Integration Tests)

#### 7.2.1 엔드투엔드 플로우 테스트

**시나리오**:
1. 블로그 포스트 추가
2. 빌드 실행
3. R2에 사이트맵 업로드 확인
4. Pages Function을 통해 사이트맵 접근
5. 응답 헤더 및 내용 검증

**테스트 스크립트**:
```bash
#!/bin/bash
# test-sitemap-flow.sh

echo "1. Building blog..."
pnpm --filter blog build

echo "2. Checking R2 upload..."
# (R2 CLI 또는 API를 통해 확인)

echo "3. Testing sitemap URL..."
curl -I https://jeongwoo.in/sitemap.xml | grep "200 OK"

echo "4. Validating content..."
curl https://jeongwoo.in/sitemap.xml | grep "<urlset"

echo "✅ All tests passed!"
```

### 7.3 수동 테스트 체크리스트

#### 7.3.1 빌드 프로세스
- [ ] `pnpm --filter blog build` 실행 시 에러 없이 완료
- [ ] 빌드 로그에 "✅ Sitemap uploaded successfully!" 메시지 출력
- [ ] `apps/blog/public/sitemap.xml` 파일 생성 확인

#### 7.3.2 R2 업로드
- [ ] Cloudflare 대시보드에서 R2 버킷 확인
- [ ] `blog/sitemap.xml` 파일 존재 확인
- [ ] 파일 크기 및 수정 시간 확인
- [ ] Content-Type이 `application/xml`로 설정됨

#### 7.3.3 Pages Function
- [ ] `https://jeongwoo.in/sitemap.xml` 접속 시 HTTP 200 응답
- [ ] 응답 헤더: `Content-Type: application/xml; charset=utf-8`
- [ ] 응답 헤더: `Cache-Control: public, max-age=3600`
- [ ] XML 내용이 정상적으로 표시됨
- [ ] 모든 블로그 포스트 URL 포함 확인

#### 7.3.4 검색엔진 검증
- [ ] Google Search Console에 사이트맵 제출
- [ ] Search Console에서 "성공" 상태 확인
- [ ] Bing Webmaster Tools에 사이트맵 제출
- [ ] 크롤링 에러 없음 확인

### 7.4 성능 테스트

#### 7.4.1 빌드 시간 측정

```bash
time pnpm --filter blog build
```

**목표**: < 30초 (100개 포스트 기준)

#### 7.4.2 Pages Function 응답 시간

```bash
curl -w "@curl-format.txt" -o /dev/null -s https://jeongwoo.in/sitemap.xml
```

**curl-format.txt**:
```
time_namelookup:  %{time_namelookup}\n
time_connect:  %{time_connect}\n
time_starttransfer:  %{time_starttransfer}\n
time_total:  %{time_total}\n
```

**목표**:
- 첫 요청 (콜드 스타트): < 500ms
- 이후 요청 (캐시): < 100ms

### 7.5 에러 시나리오 테스트

#### 7.5.1 R2 파일 없음

**시나리오**: R2에서 `sitemap.xml` 삭제 후 접근

**예상 결과**: HTTP 404, "Sitemap not found" 메시지

#### 7.5.2 R2 접근 실패

**시나리오**: R2 바인딩 제거 또는 권한 오류

**예상 결과**: HTTP 500, "Internal Server Error" 메시지

#### 7.5.3 잘못된 환경변수

**시나리오**: Blog 앱 빌드 시 R2 credentials 누락

**예상 결과**: 빌드 실패, 명확한 에러 메시지

---

## 8. 작업 계획 (Work Breakdown)

### Phase 1: 설정 및 환경 구성 (예상: 30분)

#### 1.1 환경변수 설정
- **작업**: Blog 앱의 `.env` 파일에 R2 credentials 추가
- **파일**:
  - `apps/blog/.env.development`
  - `apps/blog/.env.production`
- **선행 조건**: 없음
- **산출물**: 환경변수 설정 완료
- **검증 방법**: 파일 내용 확인

#### 1.2 wrangler.toml 설정
- **작업**: Shell 앱의 `wrangler.toml`에 R2 바인딩 추가
- **파일**: `apps/_shell/wrangler.toml`
- **선행 조건**: 없음
- **산출물**: R2 바인딩 설정 완료
- **검증 방법**: 설정 파일 검토

### Phase 2: 개발 (예상: 2시간)

#### 2.1 upload-sitemap.ts 구현
- **작업**: R2 업로드 스크립트 작성
- **파일**: `apps/blog/scripts/upload-sitemap.ts` (신규)
- **선행 조건**: Phase 1 완료
- **산출물**: 업로드 스크립트 파일
- **검증 방법**:
  - TypeScript 컴파일 에러 없음
  - 로컬에서 실행 시 R2 업로드 성공

**세부 작업**:
1. S3Client 초기화
2. 환경변수 검증 로직
3. 파일 읽기 및 업로드
4. 에러 핸들링
5. 로깅 추가

#### 2.2 sitemap.xml.ts (Pages Function) 구현
- **작업**: Pages Function 작성
- **파일**: `apps/_shell/functions/sitemap.xml.ts` (신규)
- **선행 조건**: Phase 1 완료
- **산출물**: Pages Function 파일
- **검증 방법**:
  - TypeScript 컴파일 에러 없음
  - 로컬에서 `wrangler pages dev` 실행 시 정상 동작

**세부 작업**:
1. R2 바인딩을 통한 파일 읽기
2. HTTP 헤더 설정
3. 에러 핸들링 (404, 500)
4. 로깅 추가

#### 2.3 package.json 스크립트 업데이트
- **작업**: `upload:sitemap` 스크립트 추가 및 `build` 스크립트 수정
- **파일**: `apps/blog/package.json`
- **선행 조건**: Phase 2.1 완료
- **산출물**: 업데이트된 package.json
- **검증 방법**: `pnpm upload:sitemap` 실행 시 정상 동작

### Phase 3: 통합 및 테스트 (예상: 1시간)

#### 3.1 로컬 빌드 테스트
- **작업**: Blog 앱 전체 빌드 실행 및 R2 업로드 확인
- **명령**: `pnpm --filter blog build`
- **선행 조건**: Phase 2 완료
- **산출물**:
  - `public/sitemap.xml` 생성
  - R2에 업로드된 `sitemap.xml`
- **검증 방법**:
  - 빌드 로그에서 업로드 성공 메시지 확인
  - Cloudflare 대시보드에서 R2 파일 확인

#### 3.2 Pages Function 로컬 테스트
- **작업**: Wrangler로 로컬 Pages Function 실행
- **명령**: `cd apps/_shell && wrangler pages dev dist --r2 BLOG_BUCKET=blog`
- **선행 조건**: Phase 3.1 완료
- **산출물**: 로컬 서버에서 사이트맵 접근 가능
- **검증 방법**: `curl http://localhost:8788/sitemap.xml`

#### 3.3 수동 테스트 체크리스트 실행
- **작업**: 섹션 7.3의 모든 체크리스트 항목 검증
- **선행 조건**: Phase 3.1-3.2 완료
- **산출물**: 테스트 결과 문서
- **검증 방법**: 모든 항목 통과

### Phase 4: 배포 및 검증 (예상: 1시간)

#### 4.1 Production 배포
- **작업**: Blog 앱 및 Shell 앱 배포
- **명령**:
  - `pnpm --filter blog build` (Production 환경)
  - `pnpm --filter _shell build`
  - Cloudflare Pages 자동 배포 또는 수동 배포
- **선행 조건**: Phase 3 완료
- **산출물**:
  - Production 환경에 배포된 앱
  - R2에 업로드된 최신 사이트맵
- **검증 방법**: Cloudflare Pages 대시보드에서 배포 상태 확인

#### 4.2 R2 바인딩 설정 (첫 배포 시)
- **작업**: Cloudflare Pages 대시보드에서 R2 바인딩 설정
- **선행 조건**: Phase 4.1 완료
- **산출물**: R2 바인딩 설정 완료
- **검증 방법**: Pages Function 로그에서 R2 접근 확인

#### 4.3 Production URL 테스트
- **작업**: `https://jeongwoo.in/sitemap.xml` 접근 및 검증
- **선행 조건**: Phase 4.1-4.2 완료
- **산출물**: 정상 동작하는 사이트맵 URL
- **검증 방법**:
  - HTTP 200 응답
  - 올바른 헤더 설정
  - 최신 블로그 포스트 포함

#### 4.4 검색엔진 제출
- **작업**: Google Search Console 및 Bing Webmaster Tools에 사이트맵 제출
- **선행 조건**: Phase 4.3 완료
- **산출물**: 검색엔진에 제출된 사이트맵
- **검증 방법**: Search Console에서 "성공" 상태 확인

### Phase 5: 문서화 및 정리 (예상: 30분)

#### 5.1 README 업데이트
- **작업**: 프로젝트 CLAUDE.md에 사이트맵 기능 추가
- **파일**: `.claude/CLAUDE.md`
- **선행 조건**: Phase 4 완료
- **산출물**: 업데이트된 문서
- **검증 방법**: 문서 검토

#### 5.2 배포 가이드 작성
- **작업**: 사이트맵 관련 배포 및 관리 가이드 작성
- **파일**: 이 스펙 문서의 섹션 6 참조
- **선행 조건**: Phase 4 완료
- **산출물**: 가이드 문서
- **검증 방법**: 팀원 리뷰

---

## 9. 위험 및 고려사항

### 9.1 잠재적 기술적 문제

#### 9.1.1 R2 업로드 실패

**문제**: 네트워크 불안정 또는 R2 서비스 장애로 업로드 실패

**영향**: 빌드 실패, 사이트맵 업데이트 안 됨

**해결 방안**:
- 재시도 로직 추가 (최대 3회)
- 업로드 실패 시 경고 메시지만 표시하고 빌드는 계속 진행 (선택적)
- Cloudflare Status 페이지 모니터링

**구현 예시**:
```typescript
async function uploadWithRetry(maxRetries = 3): Promise<void> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await s3Client.send(command);
      return;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      console.log(`Retry ${i + 1}/${maxRetries}...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

#### 9.1.2 Pages Function 콜드 스타트

**문제**: 첫 요청 시 응답 시간이 길어질 수 있음 (300-500ms)

**영향**: 사용자 경험 저하 (검색엔진 크롤러에는 영향 적음)

**해결 방안**:
- CDN 캐싱으로 대부분의 요청은 Edge에서 처리
- Cloudflare Workers Unbound 플랜 고려 (현재는 Free/Paid 플랜)
- 정기적인 사이트맵 접근으로 함수를 "warm" 상태로 유지 (크론 작업)

#### 9.1.3 R2 바인딩 설정 누락

**문제**: 배포 시 R2 바인딩을 설정하지 않으면 Pages Function 실패

**영향**: HTTP 500 에러, 사이트맵 접근 불가

**해결 방안**:
- 배포 체크리스트에 R2 바인딩 설정 확인 항목 추가
- Pages Function 에러 로그에 명확한 에러 메시지 포함
- 배포 후 자동 테스트 스크립트 실행

#### 9.1.4 환경변수 유출

**문제**: R2 credentials가 Git에 커밋될 위험

**영향**: 보안 취약점, 무단 R2 접근

**해결 방안**:
- `.gitignore`에 `.env*` 파일 등록 확인
- Pre-commit hook으로 `.env` 파일 커밋 방지
- GitHub Secrets Scanning 활성화
- 주기적인 R2 Access Key 교체

### 9.2 외부 시스템 의존성

#### 9.2.1 Cloudflare R2 서비스

**의존성**: R2 가용성에 의존

**리스크**: R2 장애 시 사이트맵 업로드/제공 불가

**완화 방안**:
- Cloudflare는 99.9% 가용성 보장
- 사이트맵은 자주 변경되지 않으므로 일시적 장애 시에도 기존 캐시 사용 가능
- R2 Status 페이지 모니터링

#### 9.2.2 Cloudflare Pages

**의존성**: Pages Functions 실행 환경

**리스크**: Pages 배포 실패 또는 Function 실행 오류

**완화 방안**:
- Pages 배포 로그 모니터링
- 롤백 가능한 배포 전략
- Cloudflare 지원 팀 연락 준비

### 9.3 시니어 검토가 필요한 영역

#### 9.3.1 보안 리뷰

**검토 항목**:
- R2 Access Key 권한 범위 (최소 권한 원칙)
- 환경변수 관리 방법
- Pages Function의 공개 엔드포인트 보안

**담당자**: DevOps 또는 보안 담당자

#### 9.3.2 인프라 비용 검토

**검토 항목**:
- R2 저장 비용 (무료 티어: 10GB/월)
- R2 트래픽 비용 (무료 Egress)
- Pages Functions 실행 비용 (100,000 requests/일 무료)

**담당자**: 인프라 또는 재무 담당자

**예상 비용**:
- R2 저장: < $0.01/월 (사이트맵 파일은 수 KB)
- Pages Functions: 무료 (트래픽이 낮음)

### 9.4 가정 및 미확정 요소

#### 9.4.1 가정

- [ ] Cloudflare Pages 프로젝트가 이미 설정되어 있음
- [ ] R2 버킷 `blog`가 이미 생성되어 있음
- [ ] R2 Access Key에 `blog` 버킷에 대한 읽기/쓰기 권한이 있음
- [ ] Shell 앱의 도메인이 `https://jeongwoo.in/`으로 설정되어 있음

#### 9.4.2 미확정 요소

- [ ] R2 바인딩 설정 방법 (wrangler.toml vs. 대시보드)
  - **해결 방법**: 양쪽 모두 시도하여 정상 동작하는 방법 확인
- [ ] 로컬 개발 환경에서 Pages Functions 테스트 가능 여부
  - **해결 방법**: `wrangler pages dev` 명령으로 로컬 테스트
- [ ] 사이트맵 캐싱 전략 (1시간 vs. 더 길게)
  - **해결 방법**: 초기에는 1시간으로 설정하고, 필요 시 조정

### 9.5 롤백 계획

#### 시나리오 1: R2 업로드 실패로 빌드 중단

**롤백 방법**:
1. `apps/blog/package.json`의 `build` 스크립트에서 `pnpm upload:sitemap` 제거
2. 수동으로 사이트맵 업로드

#### 시나리오 2: Pages Function 오류로 사이트맵 접근 불가

**롤백 방법**:
1. Cloudflare Pages에서 이전 배포 버전으로 롤백
2. `functions/sitemap.xml.ts` 파일 삭제 후 재배포
3. 임시로 정적 파일로 사이트맵 제공 (`public/sitemap.xml`)

---

## 10. 향후 확장 가능성

### 10.1 자동 검색엔진 제출

**목표**: 사이트맵 업데이트 시 자동으로 Google/Bing에 알림

**구현 방법**:
- Google Search Console API 사용
- Bing Webmaster Tools API 사용
- Pages Function에서 사이트맵 업로드 후 API 호출

**예상 작업량**: 2-3시간

**예시**:
```typescript
async function notifySearchEngines(sitemapUrl: string): Promise<void> {
  // Google
  await fetch(`https://www.google.com/ping?sitemap=${sitemapUrl}`);

  // Bing
  await fetch(`https://www.bing.com/ping?sitemap=${sitemapUrl}`);
}
```

### 10.2 다국어 사이트맵

**목표**: 향후 다국어 블로그 지원 시 `hreflang` 태그 추가

**구현 방법**:
- `generate-sitemap.ts`에서 `hreflang` alternate 링크 생성
- XML 구조 확장

**예상 작업량**: 1-2시간

**예시**:
```xml
<url>
  <loc>https://jeongwoo.in/blog/post-slug</loc>
  <xhtml:link rel="alternate" hreflang="ko" href="https://jeongwoo.in/ko/blog/post-slug" />
  <xhtml:link rel="alternate" hreflang="en" href="https://jeongwoo.in/en/blog/post-slug" />
</url>
```

### 10.3 사이트맵 인덱스 파일

**목표**: 블로그 포스트 수가 증가하면 여러 사이트맵으로 분할

**구현 방법**:
- 포스트 수가 500개 이상이면 자동으로 분할
- `sitemap-index.xml` 생성하여 여러 사이트맵 연결

**예상 작업량**: 2-3시간

**예시**:
```xml
<sitemapindex>
  <sitemap>
    <loc>https://jeongwoo.in/sitemap-1.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://jeongwoo.in/sitemap-2.xml</loc>
  </sitemap>
</sitemapindex>
```

### 10.4 실시간 사이트맵 생성

**목표**: R2에 정적 파일 대신, Pages Function에서 동적으로 사이트맵 생성

**구현 방법**:
- Pages Function에서 블로그 메타데이터 API 호출
- 실시간으로 사이트맵 XML 생성
- KV 또는 D1에 캐싱

**장점**: 빌드 없이 최신 포스트 즉시 반영

**단점**: 복잡도 증가, Pages Function 실행 시간 증가

**예상 작업량**: 4-6시간

### 10.5 사이트맵 분석 대시보드

**목표**: 사이트맵 접근 통계 및 크롤링 분석

**구현 방법**:
- Pages Function에서 Cloudflare Analytics API로 로그 전송
- 별도 대시보드에서 시각화 (Grafana, Cloudflare Logs)

**예상 작업량**: 6-8시간

---

## 11. 체크리스트

### 11.1 구현 완료 기준

- [ ] `apps/blog/scripts/upload-sitemap.ts` 구현 완료
- [ ] `apps/_shell/functions/sitemap.xml.ts` 구현 완료
- [ ] `apps/blog/.env.development` 환경변수 설정
- [ ] `apps/blog/.env.production` 환경변수 설정
- [ ] `apps/_shell/wrangler.toml` R2 바인딩 설정
- [ ] `apps/blog/package.json` 스크립트 업데이트
- [ ] 로컬 빌드 및 업로드 테스트 성공
- [ ] Production 배포 및 사이트맵 URL 접근 성공
- [ ] 모든 수동 테스트 체크리스트 통과
- [ ] Google Search Console 사이트맵 제출 및 검증

### 11.2 문서화 완료 기준

- [ ] 이 스펙 문서 작성 완료
- [ ] CLAUDE.md 프로젝트 문서 업데이트
- [ ] 배포 가이드 작성
- [ ] 트러블슈팅 가이드 작성

### 11.3 품질 보증

- [ ] TypeScript 타입 에러 없음
- [ ] ESLint 경고 없음
- [ ] 모든 스크립트가 정상 동작
- [ ] 에러 핸들링 구현 완료
- [ ] 로깅 메시지 명확함

---

## 12. 참고 자료

### 12.1 공식 문서

- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/)
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [AWS SDK for JavaScript v3 - S3 Client](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/)
- [Sitemap Protocol](https://www.sitemaps.org/protocol.html)
- [Google Search Console - Sitemap Guide](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)

### 12.2 관련 기술 스택 문서

- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Turborepo Documentation](https://turbo.build/repo/docs)

### 12.3 유사 프로젝트 참고

- [Next.js Sitemap Generation](https://github.com/iamvishnusankar/next-sitemap)
- [Astro Sitemap Integration](https://docs.astro.build/en/guides/integrations-guide/sitemap/)

---

## 변경 이력

| 날짜 | 버전 | 변경 내용 | 작성자 |
|------|------|----------|--------|
| 2025-12-05 | 1.0 | 초안 작성 | Claude Code |

---

**최종 검토 및 승인**:
- [ ] 기술 리뷰 완료
- [ ] 보안 리뷰 완료
- [ ] 프로젝트 오너 승인

**구현 시작 예정일**: TBD
**목표 완료일**: TBD
