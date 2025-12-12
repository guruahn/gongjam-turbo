# Bookly OCR API - Cloudflare Workers

Google Cloud Vision API를 사용하여 이미지에서 텍스트를 추출하는 Cloudflare Workers API입니다.
프론트엔드에 API 키를 노출하지 않기 위한 프록시 역할을 합니다.

## 기능

- 이미지 Base64 데이터를 받아 OCR 수행
- 한글 + 영어 텍스트 인식 지원
- CORS 설정으로 특정 도메인만 허용
- Google Cloud Service Account 인증

## 로컬 개발

### 1. 의존성 설치

```bash
cd workers/ocr-api
pnpm install
```

### 2. 환경변수 설정

Wrangler secrets를 사용하여 환경변수를 설정합니다:

```bash
# Google Cloud 프로젝트 ID
wrangler secret put GOOGLE_CLOUD_PROJECT_ID

# Google Cloud Service Account 이메일
wrangler secret put GOOGLE_CLOUD_CLIENT_EMAIL

# Google Cloud Private Key (여러 줄, \n 포함)
wrangler secret put GOOGLE_CLOUD_PRIVATE_KEY
```

또는 로컬 개발을 위해 `.dev.vars` 파일을 생성:

```bash
# .dev.vars
GOOGLE_CLOUD_PROJECT_ID=underline-project
GOOGLE_CLOUD_CLIENT_EMAIL=bookly@underline-project.iam.gserviceaccount.com
GOOGLE_CLOUD_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**주의**: `.dev.vars` 파일은 절대 Git에 커밋하지 마세요!

### 3. 로컬 서버 실행

```bash
pnpm dev
```

기본 포트: `8787`

### 4. API 테스트

```bash
curl -X POST http://localhost:8787/api/ocr \
  -H "Content-Type: application/json" \
  -d '{
    "imageBase64": "base64_encoded_image_data",
    "languageHints": ["ko", "en"]
  }'
```

**응답 예시**:
```json
{
  "text": "인식된 텍스트 내용",
  "confidence": 0.95
}
```

**에러 응답**:
```json
{
  "text": "",
  "confidence": 0,
  "error": "텍스트를 인식하지 못했습니다."
}
```

## 배포

### 1. Cloudflare 계정 로그인

```bash
wrangler login
```

### 2. Secrets 설정 (프로덕션)

```bash
wrangler secret put GOOGLE_CLOUD_PROJECT_ID --env production
wrangler secret put GOOGLE_CLOUD_CLIENT_EMAIL --env production
wrangler secret put GOOGLE_CLOUD_PRIVATE_KEY --env production
```

### 3. 배포

```bash
pnpm deploy
```

배포 후 Workers URL: `https://bookly-ocr-api.<your-subdomain>.workers.dev`

## API 명세

### POST /api/ocr

이미지에서 텍스트를 추출합니다.

**요청**:
```json
{
  "imageBase64": "base64_encoded_image_data",
  "languageHints": ["ko", "en"]  // 선택적, 기본값: ["ko", "en"]
}
```

**응답 (성공)**:
```json
{
  "text": "인식된 텍스트",
  "confidence": 0.95
}
```

**응답 (실패)**:
```json
{
  "text": "",
  "confidence": 0,
  "error": "에러 메시지"
}
```

## CORS 설정

다음 도메인만 허용됩니다:
- `http://localhost:3000` (Shell 앱 로컬)
- `http://localhost:3004` (Bookly 앱 로컬)
- `https://jeongwoo.in` (프로덕션 Shell)
- `https://bookly.jeongwoo.in` (프로덕션 Bookly)

## 보안

- API 키는 Cloudflare Workers Secrets에 저장
- 프론트엔드에 노출되지 않음
- CORS로 허용된 도메인만 접근 가능
- Google Cloud Service Account 사용

## 문제 해결

### Private Key 포맷 오류
Private key는 `\n`을 포함한 문자열로 저장해야 합니다:
```
"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADA...\n-----END PRIVATE KEY-----\n"
```

### CORS 에러
허용된 도메인 목록에 없는 경우 발생합니다. `src/index.ts`의 `allowedOrigins` 배열에 도메인을 추가하세요.

### 할당량 초과
Google Cloud Console에서 Vision API 할당량을 확인하고 필요시 증가시키세요.

## 라이선스

MIT
