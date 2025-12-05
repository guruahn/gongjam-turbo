# 사이트맵 R2 업로드 및 Cloudflare Pages Function 배포 가이드

## 구현 완료 사항

### 1. Blog 앱 (apps/blog)
- ✅ R2 환경변수 추가 (.env.development, .env.production)
- ✅ `scripts/upload-sitemap.ts` 스크립트 생성
- ✅ `@aws-sdk/client-s3` 의존성 추가
- ✅ package.json 스크립트 업데이트
  - `upload:sitemap`: 사이트맵만 R2에 업로드
  - `build`: 빌드 시 자동으로 사이트맵 생성 + R2 업로드

### 2. Shell 앱 (apps/_shell)
- ✅ `functions/sitemap.xml.ts` Pages Function 생성
- ✅ `wrangler.toml` R2 바인딩 설정

## 로컬 테스트 방법

### 1. 의존성 설치
```bash
pnpm install
```

### 2. 사이트맵 생성 및 업로드 테스트
```bash
# Blog 앱으로 이동
cd apps/blog

# 사이트맵 생성
pnpm build:sitemap

# R2에 업로드
pnpm upload:sitemap
```

**예상 출력:**
```
📤 Uploading sitemap to Cloudflare R2...

📁 Reading sitemap from: /path/to/public/sitemap.xml
☁️  Uploading to R2 bucket: blog
✅ Sitemap uploaded successfully!
🔗 R2 Path: blog/sitemap.xml
📊 Size: 1234 bytes
```

### 3. 전체 빌드 테스트
```bash
# 전체 빌드 (포스트 빌드 → Vite 빌드 → 사이트맵 생성 → R2 업로드)
pnpm build
```

## 배포 설정

### Cloudflare Pages 설정

1. **R2 바인딩 추가**
   - Cloudflare Dashboard → Pages → jeongwoo.in 프로젝트
   - Settings → Functions → R2 Bucket Bindings
   - 바인딩 추가:
     - Variable name: `BLOG_BUCKET`
     - R2 bucket: `blog`

2. **환경변수 설정 (Blog 앱 배포용)**
   - Settings → Environment variables
   - Production 환경에 다음 변수 추가:
     - `VITE_R2_ENDPOINT`: (guestbook에서 사용 중인 값)
     - `VITE_R2_ACCESS_KEY_ID`: (guestbook에서 사용 중인 값)
     - `VITE_R2_SECRET_ACCESS_KEY`: (guestbook에서 사용 중인 값)
     - `VITE_R2_BUCKET_NAME`: `blog`

## 배포 후 검증

### 1. 사이트맵 접근 확인
```bash
curl https://jeongwoo.in/sitemap.xml
```

**예상 응답:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://jeongwoo.in/blog</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <lastmod>2024-12-05</lastmod>
  </url>
  ...
</urlset>
```

### 2. 헤더 확인
```bash
curl -I https://jeongwoo.in/sitemap.xml
```

**확인 항목:**
- ✅ `Content-Type: application/xml`
- ✅ `Cache-Control: max-age=3600`
- ✅ `X-Content-Source: cloudflare-r2`

### 3. 검색엔진 제출

#### Google Search Console
1. https://search.google.com/search-console 접속
2. 왼쪽 메뉴 → Sitemaps
3. 사이트맵 URL 입력: `https://jeongwoo.in/sitemap.xml`
4. 제출

#### Bing Webmaster Tools
1. https://www.bing.com/webmasters 접속
2. Sitemaps → Submit Sitemap
3. 사이트맵 URL 입력: `https://jeongwoo.in/sitemap.xml`
4. 제출

## 트러블슈팅

### 문제 1: R2 업로드 실패 (credentials error)
**원인**: 환경변수가 제대로 설정되지 않음

**해결:**
```bash
# .env.development 또는 .env.production 확인
cat apps/blog/.env.production

# 환경변수가 있는지 확인
echo $VITE_R2_ENDPOINT
```

### 문제 2: Pages Function에서 404 에러
**원인**: R2 바인딩이 설정되지 않음

**해결:**
1. Cloudflare Dashboard에서 R2 바인딩 확인
2. 바인딩 이름이 `BLOG_BUCKET`인지 확인
3. 버킷 이름이 `blog`인지 확인

### 문제 3: 사이트맵이 업데이트되지 않음
**원인**: CDN 캐시 또는 R2 업로드 누락

**해결:**
```bash
# 1. 사이트맵 재생성 및 업로드
pnpm --filter blog build:sitemap
pnpm --filter blog upload:sitemap

# 2. Cloudflare 캐시 퍼지
# Dashboard → Caching → Purge Cache → Custom Purge
# URL: https://jeongwoo.in/sitemap.xml
```

## 유용한 명령어

```bash
# Blog 앱만 빌드 (사이트맵 포함)
pnpm --filter blog build

# 사이트맵만 재업로드
pnpm --filter blog upload:sitemap

# Shell 앱 빌드
pnpm --filter _shell build

# 전체 프로젝트 빌드
pnpm build

# R2 버킷 내용 확인 (wrangler CLI 사용)
wrangler r2 object get blog/sitemap.xml
```

## 다음 단계

1. ✅ 로컬에서 사이트맵 생성 및 R2 업로드 테스트
2. ✅ Blog 앱 배포 (자동으로 R2 업로드 포함)
3. ✅ Cloudflare Pages에서 R2 바인딩 설정
4. ✅ Shell 앱 배포
5. ✅ https://jeongwoo.in/sitemap.xml 접근 테스트
6. ✅ Google Search Console 및 Bing에 사이트맵 제출

## 참고 자료

- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/)
- [Cloudflare R2](https://developers.cloudflare.com/r2/)
- [R2 Bindings in Pages](https://developers.cloudflare.com/pages/functions/bindings/#r2-buckets)
- [Sitemap Protocol](https://www.sitemaps.org/protocol.html)
- [Google Search Console](https://search.google.com/search-console)
