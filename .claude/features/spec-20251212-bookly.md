# Feature Specification: Bookly - OCR 기반 독서 메모 앱

**작성일**: 2025-12-12
**작성자**: Claude Code (Feature Specification Architect)
**상태**: Draft
**우선순위**: Medium

## 목차
- [1. 기능 개요](#1-기능-개요)
- [2. 기술 요구사항](#2-기술-요구사항)
- [3. 데이터베이스 설계](#3-데이터베이스-설계)
- [4. 시스템 아키텍처](#4-시스템-아키텍처)
- [5. API 명세](#5-api-명세)
- [6. UI/UX 설계](#6-uiux-설계)
- [7. 보안 및 권한 관리](#7-보안-및-권한-관리)
- [8. 테스트 전략](#8-테스트-전략)
- [9. 구현 계획](#9-구현-계획)
- [10. 기술적 고려사항](#10-기술적-고려사항)
- [11. 위험 요소 및 대응방안](#11-위험-요소-및-대응방안)

---

## 1. 기능 개요

### 1.1 목적 및 설명
Bookly는 독서 중 인상 깊은 문구를 빠르게 기록하고 관리할 수 있는 개인용 독서 메모 애플리케이션입니다. 모바일에서 책의 문구를 촬영하면 OCR을 통해 자동으로 텍스트로 변환하여 저장하고, 나중에 검색하고 관리할 수 있습니다.

### 1.2 사용자 스토리

**관리자(본인) As Admin:**
- 모바일 카메라로 책의 문구를 촬영하여 메모를 생성하고 싶다
- 기존 사진 갤러리에서 이미 찍어둔 책 사진을 업로드하고 싶다
- 업로드한 이미지에서 원하는 영역만 선택(크롭)하고 싶다
- 크롭한 이미지를 텍스트로 자동 변환하고 싶다
- OCR 결과를 수정하고 책 제목, 저자, 페이지 등 메타데이터를 추가하고 싶다
- 저장된 메모를 목록으로 조회하고 검색하고 싶다
- 기존 메모를 수정하거나 삭제하고 싶다
- 책 제목이나 저자별로 메모를 필터링하고 싶다

**미래 확장 고려사항:**
- 다른 사용자와 메모를 공유하고 싶다
- 메모에 태그를 추가하여 분류하고 싶다
- 메모를 Export (PDF, TXT 등)하고 싶다

### 1.3 성공 지표
- OCR 정확도: 한글 텍스트 인식률 95% 이상
- 메모 생성 시간: 이미지 업로드부터 저장까지 30초 이내
- 모바일 사용성: 터치 인터랙션이 직관적이고 반응성 좋음
- 관리자 만족도: 실제 독서 중 활용 가능한 수준

### 1.4 연관 리소스
- 태스크 링크: N/A (내부 프로젝트)
- 피그마 디자인: N/A (기존 디자인 시스템 활용)
- 참고 문서: [CLAUDE.md](/Users/jeongwooahn/Documents/projects/gongjam-www/.claude/CLAUDE.md)

---

## 2. 기술 요구사항

### 2.1 시스템 아키텍처
- **아키텍처 패턴**: Module Federation (Vite) - Remote 앱
- **통합 방식**: Shell 앱에 Federated Module로 통합
- **독립 실행**: Standalone 모드 지원 (개발 및 테스트용)

### 2.2 기술 스택

#### Frontend
- **Framework**: Vue 3.5.13 (Composition API)
- **Language**: TypeScript 5.6.3 (Strict Mode)
- **Build Tool**: Vite 6.0.3
- **Module Federation**: @module-federation/vite 1.9.0
- **Router**: Vue Router 4.4.5 (MemoryHistory for federated mode)
- **Styling**: Tailwind CSS 3.4.17

#### Backend Services
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **OCR**: Google Cloud Vision API
  - Text Detection API 사용
  - 한글 언어 지원 (language_hints: ['ko'])

#### Development Tools
- **Testing**: Vitest 3.2.4
- **Linting**: ESLint 8.57.0
- **Type Check**: vue-tsc 2.1.10

### 2.3 외부 라이브러리

#### 필수 라이브러리
```json
{
  "dependencies": {
    "@gongjam/ui": "workspace:*",
    "@supabase/supabase-js": "^2.39.0",
    "vue": "^3.5.13",
    "vue-router": "^4.4.5",
    "vue-advanced-cropper": "^2.8.8",
    "@google-cloud/vision": "^4.3.2",
    "date-fns": "^4.1.0"
  }
}
```

#### 이미지 크롭
- **라이브러리**: vue-advanced-cropper
- **선택 이유**:
  - Vue 3 완전 지원
  - 터치 제스처 지원 (모바일 최적화)
  - 커스터마이징 가능한 UI
  - TypeScript 타입 정의 제공

### 2.4 파일 구조 및 모듈 구성

```
apps/bookly/
├── src/
│   ├── App.vue                      # 앱 엔트리 포인트
│   ├── BooklyShell.vue              # Federated Shell 컴포넌트
│   ├── bootstrap.ts                 # Bootstrap 로직 (mount/unmount)
│   ├── router.ts                    # Vue Router 설정
│   ├── style.css                    # Global styles (Tailwind)
│   │
│   ├── pages/                       # 페이지 컴포넌트
│   │   ├── BooklyListPage.vue       # 메모 목록 페이지
│   │   ├── BooklyCreatePage.vue     # 메모 생성 페이지
│   │   └── BooklyDetailPage.vue     # 메모 상세/수정 페이지
│   │
│   ├── components/                  # UI 컴포넌트
│   │   ├── ImageUploader.vue        # 이미지 업로드 (카메라/파일)
│   │   ├── ImageCropper.vue         # 이미지 크롭 도구
│   │   ├── OcrResult.vue            # OCR 결과 표시/편집
│   │   ├── BookMemoCard.vue         # 메모 카드
│   │   ├── BookMemoForm.vue         # 메모 작성/수정 폼
│   │   └── BookMemoSearch.vue       # 검색 및 필터 컴포넌트
│   │
│   ├── composables/                 # Composition API
│   │   ├── useAuth.ts               # 인증 관리 (from guestbook)
│   │   ├── useBookMemo.ts           # 메모 CRUD
│   │   ├── useImageUpload.ts        # 이미지 업로드 로직
│   │   ├── useOcr.ts                # OCR API 호출
│   │   └── useBookMemoSearch.ts     # 검색 및 필터링
│   │
│   ├── utils/                       # 유틸리티 함수
│   │   ├── supabase.ts              # Supabase 클라이언트 및 API
│   │   ├── ocr.ts                   # Google Vision API 래퍼
│   │   ├── imageProcessing.ts       # 이미지 압축 및 포맷 변환
│   │   └── validation.ts            # 입력 검증
│   │
│   └── types/                       # TypeScript 타입 정의
│       ├── bookMemo.ts              # 메모 관련 타입
│       ├── ocr.ts                   # OCR 관련 타입
│       └── image.ts                 # 이미지 관련 타입
│
├── vite.config.ts                   # Vite + Module Federation 설정
├── tailwind.config.js               # Tailwind 설정
├── vitest.config.ts                 # Vitest 설정
├── .env.development                 # 로컬 환경변수
├── .env.production                  # 배포 환경변수
├── package.json
└── tsconfig.json
```

### 2.5 라우터 구성

#### Bookly 앱 내부 라우트 (`router.ts`)
```typescript
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'BooklyList',
    component: BooklyListPage,
    meta: {
      title: '독서 메모',
      requiresAuth: true
    },
  },
  {
    path: '/create',
    name: 'BooklyCreate',
    component: BooklyCreatePage,
    meta: {
      title: '메모 생성',
      requiresAuth: true
    },
  },
  {
    path: '/:id',
    name: 'BooklyDetail',
    component: BooklyDetailPage,
    props: true,
    meta: {
      title: '메모 상세',
      requiresAuth: true
    },
  },
];
```

#### Shell 앱 라우트 추가 (`apps/_shell/src/router.ts`)
```typescript
{
  path: '/bookly/:pathMatch(.*)*',
  component: () => import('bookly/BooklyShell'),
  props: { mode: 'federated', basePath: '/bookly' },
}
```

### 2.6 상태 관리 방식
- **Local State**: Vue 3 Composition API (ref, reactive)
- **Global State**: Composables를 통한 상태 공유
- **서버 상태**: Supabase Real-time Subscriptions (옵션)
- **캐싱**: 없음 (필요시 추후 추가)

### 2.7 로깅 및 모니터링
- **개발 환경**: `console.log` / `console.error`
- **프로덕션**: 에러 발생 시 콘솔 로그 (추후 Sentry 등 도입 고려)

### 2.8 스타일 시트
- **Framework**: Tailwind CSS 3.4.17
- **구성**: `style.css` (global)
- **컴포넌트 스타일**: Scoped styles + Tailwind utility classes
- **다크모드**: 기존 Shell 앱의 다크모드 설정 활용

### 2.9 빌드 도구 및 방식
- **빌드 도구**: Vite 6.0.3
- **Module Federation**: @module-federation/vite 1.9.0
- **출력**: `dist/` (remoteEntry.js + assets)
- **배포**: Cloudflare Pages (예상)

---

## 3. 데이터베이스 설계

### 3.1 Supabase 테이블 스키마

#### `book_memos` 테이블
```sql
CREATE TABLE book_memos (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 책 정보
  book_title TEXT NOT NULL,                    -- 책 제목
  author TEXT,                                 -- 저자
  page INTEGER,                                -- 페이지 번호

  -- 메모 내용
  content TEXT NOT NULL,                       -- OCR 변환된 텍스트
  note TEXT,                                   -- 개인 메모

  -- 메타데이터
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,

  -- 인덱스 최적화
  CONSTRAINT book_title_not_empty CHECK (char_length(book_title) > 0),
  CONSTRAINT content_not_empty CHECK (char_length(content) > 0)
);

-- 인덱스
CREATE INDEX idx_book_memos_created_at ON book_memos(created_at DESC);
CREATE INDEX idx_book_memos_book_title ON book_memos(book_title);
CREATE INDEX idx_book_memos_author ON book_memos(author);

-- Full-text search (선택적)
ALTER TABLE book_memos ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('korean', coalesce(book_title, '') || ' ' ||
                          coalesce(author, '') || ' ' ||
                          coalesce(content, '') || ' ' ||
                          coalesce(note, ''))
  ) STORED;

CREATE INDEX idx_book_memos_search ON book_memos USING GIN(search_vector);

-- Updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_book_memos_updated_at
  BEFORE UPDATE ON book_memos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

#### `admin_users` 테이블 (재사용)
guestbook과 동일한 `admin_users` 테이블 사용
```sql
-- 이미 존재하는 테이블 (guestbook에서 사용 중)
-- 별도 생성 불필요
```

### 3.2 Row Level Security (RLS) 정책

```sql
-- RLS 활성화
ALTER TABLE book_memos ENABLE ROW LEVEL SECURITY;

-- 관리자만 모든 작업 가능
CREATE POLICY "Admin full access on book_memos"
ON book_memos
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
  )
);

-- 익명 사용자는 접근 불가
CREATE POLICY "No anonymous access on book_memos"
ON book_memos
FOR ALL
USING (auth.uid() IS NOT NULL);
```

### 3.3 데이터 검증 규칙
- `book_title`: 필수, 최소 1자
- `content`: 필수, 최소 1자
- `author`: 선택, 최대 100자
- `page`: 선택, 양수
- `note`: 선택, 최대 1000자

---

## 4. 시스템 아키텍처

### 4.1 Module Federation 구성

#### `vite.config.ts`
```typescript
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { federation } from '@module-federation/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isDevelopment = mode === 'development';
  const baseUrl = !isDevelopment && env.VITE_BASE_URL
    ? env.VITE_BASE_URL + '/'
    : '/';

  return {
    base: baseUrl,
    plugins: [
      vue(),
      federation({
        name: 'bookly',
        filename: 'remoteEntry.js',
        exposes: {
          './bootstrap': './src/bootstrap.ts',
          './BooklyShell': './src/BooklyShell.vue',
          './App': './src/App.vue',
          './BooklyRouter': './src/router.ts',
          './BooklyListPage': './src/pages/BooklyListPage.vue',
          './BooklyCreatePage': './src/pages/BooklyCreatePage.vue',
          './BooklyDetailPage': './src/pages/BooklyDetailPage.vue',
        },
        shared: {
          vue: {},
          'vue-router': {},
        },
      }),
    ],
    server: {
      port: 3004,
      open: true,
    },
    preview: {
      port: 3004,
    },
    experimental: {
      renderBuiltUrl(
        filename: string,
        { hostType }: { hostType: 'js' | 'css' | 'html' }
      ) {
        if (!isDevelopment && baseUrl !== '/') {
          return baseUrl + filename;
        }
        return { relative: true };
      },
    },
    build: {
      modulePreload: true,
      target: 'esnext',
      minify: true,
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          minifyInternalExports: false,
        },
      },
    },
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  };
});
```

#### Shell 앱 `vite.config.ts` 업데이트
```typescript
// apps/_shell/vite.config.ts
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isDevelopment = mode === 'development';

  return {
    plugins: [
      vue(),
      federation({
        name: 'shell',
        remotes: {
          // 기존 remotes...
          bookly: {
            type: 'module',
            name: 'bookly',
            entry: !isDevelopment
              ? `${env.VITE_BOOKLY_URL}/remoteEntry.js`
              : 'http://localhost:3004/remoteEntry.js',
            entryGlobalName: 'bookly',
            shareScope: 'default',
          },
        },
        // ...
      }),
    ],
    // ...
  };
});
```

### 4.2 환경변수

#### `.env.development`
```env
VITE_BASE_URL=http://localhost:3004
VITE_SUPABASE_URL=https://tmsqdcswmhjwwpfnclmk.supabase.co
VITE_SUPABASE_KEY=sb_publishable_dYZqPInm6Vq8EVKs2KF4ig_UqkP22TX
VITE_OCR_API_ENDPOINT=http://localhost:8787/api/ocr  # Cloudflare Workers local
```

#### `.env.production`
```env
VITE_BASE_URL=https://bookly.jeongwoo.in
VITE_SUPABASE_URL=https://tmsqdcswmhjwwpfnclmk.supabase.co
VITE_SUPABASE_KEY=sb_publishable_dYZqPInm6Vq8EVKs2KF4ig_UqkP22TX
VITE_OCR_API_ENDPOINT=https://workers.jeongwoo.in/api/ocr  # Cloudflare Workers
```

**주의**: Google Vision API 키는 Cloudflare Workers에서만 사용하며 프론트엔드 환경변수에 포함하지 않습니다.

### 4.3 배포 URL 구조
- **Bookly Remote**: `https://bookly.jeongwoo.in/remoteEntry.js`
- **Shell 통합**: `https://jeongwoo.in/bookly/*`

### 4.4 데이터 흐름

```
사용자 (관리자)
    ↓
┌───────────────────────────────────────┐
│  BooklyCreatePage.vue                 │
│  - ImageUploader (카메라/파일)         │
│  - ImageCropper (영역 선택)            │
│  - OcrResult (텍스트 표시/편집)        │
│  - BookMemoForm (메타데이터 입력)      │
└───────────────────────────────────────┘
    ↓                          ↓
useImageUpload()          useOcr()
    ↓                          ↓
imageProcessing.ts        ocr.ts
(이미지 압축/변환)        (Google Vision API)
    ↓                          ↓
┌───────────────────────────────────────┐
│  useBookMemo()                        │
│  - createMemo()                       │
│  - updateMemo()                       │
│  - deleteMemo()                       │
│  - fetchMemos()                       │
│  - searchMemos()                      │
└───────────────────────────────────────┘
    ↓
supabase.ts
(Supabase API)
    ↓
┌───────────────────────────────────────┐
│  Supabase (PostgreSQL)                │
│  - book_memos 테이블                  │
│  - RLS 정책 (관리자만 접근)            │
└───────────────────────────────────────┘
```

---

## 5. API 명세

### 5.1 Google Cloud Vision API

#### Text Detection (OCR)
```typescript
// utils/ocr.ts

interface OcrRequest {
  imageBase64: string;      // Base64 encoded image
  languageHints?: string[]; // ['ko', 'en']
}

interface OcrResponse {
  text: string;             // 추출된 텍스트
  confidence: number;       // 신뢰도 (0-1)
  error?: string;           // 에러 메시지
}

async function detectText(request: OcrRequest): Promise<OcrResponse>
```

**API 엔드포인트**:
```
POST https://vision.googleapis.com/v1/images:annotate?key={API_KEY}
```

**요청 바디**:
```json
{
  "requests": [
    {
      "image": {
        "content": "base64_encoded_image_data"
      },
      "features": [
        {
          "type": "TEXT_DETECTION"
        }
      ],
      "imageContext": {
        "languageHints": ["ko"]
      }
    }
  ]
}
```

**응답**:
```json
{
  "responses": [
    {
      "textAnnotations": [
        {
          "description": "인식된 전체 텍스트",
          "locale": "ko"
        }
      ],
      "fullTextAnnotation": {
        "text": "인식된 텍스트",
        "pages": []
      }
    }
  ]
}
```

### 5.2 Supabase API

#### 메모 목록 조회
```typescript
async function fetchBookMemos(
  page: number = 0,
  limit: number = 20,
  filters?: {
    bookTitle?: string;
    author?: string;
    searchQuery?: string;
  }
): Promise<{
  memos: BookMemo[];
  total: number;
  hasMore: boolean;
}>
```

#### 메모 생성
```typescript
async function createBookMemo(data: BookMemoFormData): Promise<BookMemo>
```

#### 메모 수정
```typescript
async function updateBookMemo(id: string, data: Partial<BookMemoFormData>): Promise<BookMemo>
```

#### 메모 삭제
```typescript
async function deleteBookMemo(id: string): Promise<void>
```

#### 메모 검색 (Full-text search)
```typescript
async function searchBookMemos(query: string): Promise<BookMemo[]>
```

---

## 6. UI/UX 설계

### 6.1 주요 페이지

#### 6.1.1 BooklyListPage (메모 목록)
**레이아웃**:
```
┌──────────────────────────────────┐
│  Header: "독서 메모"              │
│  [검색] [필터] [+ 새 메모]        │
├──────────────────────────────────┤
│                                  │
│  ┌────────────────────────────┐  │
│  │ BookMemoCard               │  │
│  │ - 책 제목 / 저자            │  │
│  │ - 메모 내용 (미리보기)      │  │
│  │ - 페이지 / 생성일           │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │ BookMemoCard               │  │
│  └────────────────────────────┘  │
│                                  │
│  [더 보기]                       │
└──────────────────────────────────┘
```

**기능**:
- 메모 목록 표시 (최신순)
- 검색: 책 제목, 저자, 내용
- 필터: 책 제목, 저자
- ✅ **페이지네이션**: 페이지 버튼 방식 (확정)
- 카드 클릭 → 상세 페이지 이동

#### 6.1.2 BooklyCreatePage (메모 생성)
**레이아웃**:
```
┌──────────────────────────────────┐
│  Header: "메모 생성"              │
├──────────────────────────────────┤
│  Step 1: 이미지 업로드             │
│  ┌────────────────────────────┐  │
│  │ ImageUploader              │  │
│  │ [📷 카메라] [📁 파일]       │  │
│  └────────────────────────────┘  │
├──────────────────────────────────┤
│  Step 2: 영역 선택 (크롭)         │
│  ┌────────────────────────────┐  │
│  │ ImageCropper               │  │
│  │ (드래그하여 영역 선택)       │  │
│  └────────────────────────────┘  │
│  [크롭 완료]                      │
├──────────────────────────────────┤
│  Step 3: OCR 변환                 │
│  ┌────────────────────────────┐  │
│  │ OcrResult                  │  │
│  │ "변환된 텍스트..."          │  │
│  │ [수정]                      │  │
│  └────────────────────────────┘  │
│  [텍스트 확정]                    │
├──────────────────────────────────┤
│  Step 4: 메타데이터 입력           │
│  ┌────────────────────────────┐  │
│  │ BookMemoForm               │  │
│  │ - 책 제목 *                 │  │
│  │ - 저자                      │  │
│  │ - 페이지                    │  │
│  │ - 개인 메모 (선택)          │  │
│  └────────────────────────────┘  │
│  [취소] [저장]                    │
└──────────────────────────────────┘
```

**사용자 흐름**:
1. 이미지 업로드 (카메라 또는 파일)
2. 이미지에서 텍스트 영역 선택 (크롭)
3. OCR 실행 및 결과 확인/수정
4. 책 제목, 저자, 페이지, 개인 메모 입력
5. 저장

**인터랙션**:
- 단계별 UI 표시/숨김
- 로딩 인디케이터 (OCR 중)
- 에러 메시지 표시
- 모바일 터치 제스처 지원

#### 6.1.3 BooklyDetailPage (메모 상세/수정)
**레이아웃**:
```
┌──────────────────────────────────┐
│  Header: "메모 상세"              │
│  [편집] [삭제]                    │
├──────────────────────────────────┤
│  책 제목: 사피엔스                │
│  저자: 유발 하라리                │
│  페이지: 42                       │
├──────────────────────────────────┤
│  메모 내용:                       │
│  "인류는 상상의 공동체를..."      │
│                                  │
│  개인 메모:                       │
│  "매우 흥미로운 관점..."          │
├──────────────────────────────────┤
│  생성일: 2025-12-12               │
│  수정일: 2025-12-12               │
└──────────────────────────────────┘
```

**기능**:
- 메모 상세 정보 표시
- 편집 버튼 → 수정 모드
- 삭제 버튼 → 확인 후 삭제

### 6.2 반응형 디자인
- **모바일 우선**: 320px ~ 768px
- **태블릿**: 768px ~ 1024px
- **데스크톱**: 1024px+

### 6.3 접근성
- 키보드 네비게이션 지원
- ARIA 레이블 추가
- 색상 대비 WCAG AA 준수
- 스크린 리더 지원

---

## 7. 보안 및 권한 관리

### 7.1 인증 및 권한
- **인증 방식**: Supabase Auth (이메일/비밀번호)
- **권한 관리**: RLS (Row Level Security)
- **관리자 확인**: `admin_users` 테이블 조회

### 7.2 API 키 보안
- **Google Vision API 키**:
  - ✅ **Cloudflare Workers로 API 키 은닉** (확정)
  - API 키 파일: `underline-project-da29755f69bf.json`
  - 프론트엔드에 노출 금지
  - Cloudflare Workers가 프록시 역할 수행
  - 일일 할당량 설정 (비용 관리)

**구현 방식**:
- Cloudflare Workers 엔드포인트: `/api/ocr`
- Workers에서 Google Vision API 호출
- 프론트엔드는 Workers 엔드포인트만 호출

### 7.3 데이터 보안
- **RLS 정책**: 관리자만 CRUD 가능
- **이미지 미저장**: 개인정보 보호 및 저장 공간 절약
- **SQL Injection 방지**: Supabase ORM 사용

### 7.4 HTTPS
- 모든 API 통신 HTTPS 사용
- Mixed Content 경고 방지

---

## 8. 테스트 전략

### 8.1 단위 테스트 (Vitest)

#### Composables
- `useBookMemo.ts`: CRUD 로직 테스트
- `useImageUpload.ts`: 이미지 업로드 로직 테스트
- `useOcr.ts`: OCR API 호출 모킹 테스트

#### Utilities
- `imageProcessing.ts`: 이미지 압축/변환 테스트
- `validation.ts`: 입력 검증 테스트
- `ocr.ts`: API 응답 파싱 테스트

#### Components
- `ImageUploader.vue`: 파일 업로드 이벤트 테스트
- `ImageCropper.vue`: 크롭 영역 선택 테스트
- `BookMemoCard.vue`: 렌더링 및 클릭 이벤트 테스트

**테스트 커버리지 목표**: 80% 이상

### 8.2 통합 테스트 (선택적)
- 페이지 간 네비게이션 테스트
- 폼 제출 및 데이터 저장 테스트
- 에러 처리 시나리오 테스트

### 8.3 E2E 테스트 (선택적)
- Playwright 활용
- 전체 사용자 시나리오 테스트:
  1. 로그인
  2. 메모 생성 (이미지 업로드 → 크롭 → OCR → 저장)
  3. 메모 목록 조회
  4. 메모 수정
  5. 메모 삭제

### 8.4 수동 테스트
- 모바일 기기 실제 테스트 (iOS Safari, Android Chrome)
- 카메라 권한 요청 테스트
- 다양한 이미지 크기 및 포맷 테스트
- 한글 OCR 정확도 테스트

---

## 9. 구현 계획

### Phase 1: 프로젝트 설정 및 인프라 (예상: 4-6시간)

#### 1.1 프로젝트 초기화
- [ ] `apps/bookly/` 디렉토리 생성
- [ ] `package.json` 설정
  - Vue 3, TypeScript, Vite 의존성
  - vue-advanced-cropper, @google-cloud/vision, @supabase/supabase-js
- [ ] `vite.config.ts` 설정 (Module Federation)
- [ ] `tsconfig.json` 설정
- [ ] `tailwind.config.js` 설정
- [ ] `.env.development` / `.env.production` 생성

**산출물**:
- 프로젝트 초기 구조
- 빌드 가능한 기본 앱

**검증 방법**:
- `pnpm install` 성공
- `pnpm dev` 실행 시 http://localhost:3004 접속 가능

#### 1.2 Supabase 데이터베이스 설정
- [ ] `book_memos` 테이블 생성
- [ ] RLS 정책 설정
- [ ] 인덱스 생성
- [ ] Full-text search 설정 (선택적)

**산출물**:
- Supabase 스키마 설정 완료
- 테스트 데이터 삽입 가능

**검증 방법**:
- Supabase 대시보드에서 테이블 확인
- 관리자 계정으로 INSERT/SELECT 테스트

#### 1.3 Google Vision API 설정
- [ ] Google Cloud 프로젝트 생성
- [ ] Vision API 활성화
- [ ] API 키 생성
- [ ] API 키 제한 설정 (도메인, 할당량)

**산출물**:
- Google Vision API 키
- API 키 환경변수 설정

**검증 방법**:
- Postman으로 API 호출 테스트

#### 1.4 Shell 앱 통합
- [ ] `apps/_shell/vite.config.ts`에 bookly remote 추가
- [ ] `apps/_shell/src/router.ts`에 `/bookly` 라우트 추가
- [ ] `apps/_shell/.env.development`에 `VITE_BOOKLY_URL` 추가

**산출물**:
- Shell 앱에서 Bookly 앱 로드 가능

**검증 방법**:
- Shell 앱에서 http://localhost:3000/bookly 접속 시 Bookly 앱 렌더링

#### 1.5 Root `package.json` 스크립트 추가
- [ ] `dev:bookly` 스크립트 추가
- [ ] `dev:all` 스크립트에 bookly 추가

**산출물**:
- `pnpm dev:bookly` 실행 가능
- `pnpm dev:all`로 전체 앱 동시 실행 가능

**검증 방법**:
- `pnpm dev:bookly` 실행 시 포트 3004 오픈
- `pnpm dev:all` 실행 시 shell, hello, blog, guestbook, bookly 모두 실행

---

### Phase 2: 핵심 기능 개발 (예상: 12-16시간)

#### 2.1 타입 정의 및 유틸리티
- [ ] `types/bookMemo.ts`: BookMemo, BookMemoFormData 타입 정의
- [ ] `types/ocr.ts`: OcrRequest, OcrResponse 타입 정의
- [ ] `types/image.ts`: ImageFile, CropArea 타입 정의
- [ ] `utils/supabase.ts`: Supabase 클라이언트 및 CRUD 함수
- [ ] `utils/ocr.ts`: Google Vision API 래퍼 함수
- [ ] `utils/imageProcessing.ts`: 이미지 압축, Base64 변환
- [ ] `utils/validation.ts`: 폼 검증 함수

**산출물**:
- 타입 정의 완료
- 유틸리티 함수 구현 완료

**검증 방법**:
- 타입스크립트 타입 체크 통과
- 단위 테스트 작성 및 통과

#### 2.2 Composables 구현
- [ ] `composables/useAuth.ts`: guestbook 패턴 재사용
- [ ] `composables/useBookMemo.ts`: CRUD 로직
- [ ] `composables/useImageUpload.ts`: 이미지 업로드 로직
- [ ] `composables/useOcr.ts`: OCR API 호출
- [ ] `composables/useBookMemoSearch.ts`: 검색 및 필터링

**산출물**:
- Composables 구현 완료

**검증 방법**:
- 단위 테스트 작성 및 통과
- 각 composable 독립적으로 동작 확인

#### 2.3 기본 컴포넌트 구현
- [ ] `components/ImageUploader.vue`: 카메라/파일 업로드
  - `<input type="file" accept="image/*" capture="environment">` (모바일 카메라)
  - 파일 선택 UI
  - 이미지 미리보기
- [ ] `components/ImageCropper.vue`: vue-advanced-cropper 활용
  - 크롭 영역 선택 UI
  - 크롭 완료 버튼
  - 크롭된 이미지 추출 (Base64)
- [ ] `components/OcrResult.vue`: OCR 결과 표시 및 편집
  - 텍스트 영역 (편집 가능)
  - 로딩 스피너
  - 에러 메시지
- [ ] `components/BookMemoCard.vue`: 메모 카드
  - 책 제목, 저자 표시
  - 메모 내용 미리보기
  - 클릭 이벤트
- [ ] `components/BookMemoForm.vue`: 메모 작성/수정 폼
  - 책 제목, 저자, 페이지 입력
  - 개인 메모 텍스트 영역
  - 제출/취소 버튼
- [ ] `components/BookMemoSearch.vue`: 검색 및 필터
  - 검색 입력 필드
  - 필터 옵션 (책 제목, 저자)

**산출물**:
- 모든 컴포넌트 구현 완료

**검증 방법**:
- 각 컴포넌트 독립적으로 렌더링 확인
- Props 및 이벤트 핸들러 동작 확인
- 단위 테스트 작성

#### 2.4 페이지 구현
- [ ] `pages/BooklyListPage.vue`: 메모 목록
  - useBookMemo()로 데이터 가져오기
  - BookMemoCard 목록 렌더링
  - 검색/필터 기능
  - 페이지네이션
  - "+ 새 메모" 버튼
- [ ] `pages/BooklyCreatePage.vue`: 메모 생성
  - 단계별 UI (이미지 업로드 → 크롭 → OCR → 폼 작성)
  - useImageUpload(), useOcr(), useBookMemo() 활용
  - 저장 및 취소 로직
- [ ] `pages/BooklyDetailPage.vue`: 메모 상세/수정
  - 메모 데이터 표시
  - 편집 모드 전환
  - 수정 및 삭제 기능

**산출물**:
- 모든 페이지 구현 완료
- 페이지 간 네비게이션 가능

**검증 방법**:
- 각 페이지 접속 및 렌더링 확인
- 사용자 시나리오 수동 테스트

#### 2.5 라우터 및 Bootstrap
- [ ] `router.ts`: 라우트 정의
- [ ] `bootstrap.ts`: mount/unmount 로직
  - MemoryHistory 설정
  - Navigation Guard (requiresAuth)
  - popstate 이벤트 핸들러
- [ ] `BooklyShell.vue`: Federated Shell 컴포넌트
  - guestbook 패턴 재사용
  - mount/unmount 호출
- [ ] `App.vue`: 앱 엔트리 포인트

**산출물**:
- Module Federation 통합 완료
- Shell 앱에서 Bookly 앱 정상 작동

**검증 방법**:
- Shell 앱에서 `/bookly` 접속
- 페이지 간 네비게이션 정상 작동
- 브라우저 뒤로가기/앞으로가기 정상 작동

---

### Phase 3: 통합 및 테스트 (예상: 6-8시간)

#### 3.1 단위 테스트 작성
- [ ] Composables 테스트
- [ ] Utilities 테스트
- [ ] Components 테스트
- [ ] 테스트 커버리지 확인 (80% 이상)

**산출물**:
- 모든 테스트 통과
- 테스트 커버리지 리포트

**검증 방법**:
- `pnpm test` 실행 시 모든 테스트 통과
- `pnpm test:coverage` 실행 시 80% 이상

#### 3.2 통합 테스트 및 버그 수정
- [ ] 전체 사용자 시나리오 테스트
  - 로그인
  - 메모 생성 (이미지 업로드 → 크롭 → OCR → 저장)
  - 메모 목록 조회
  - 메모 검색
  - 메모 수정
  - 메모 삭제
- [ ] 모바일 기기 테스트
  - iOS Safari
  - Android Chrome
- [ ] 버그 수정 및 리팩토링

**산출물**:
- 버그 없는 안정적인 앱

**검증 방법**:
- 모든 시나리오 통과
- 주요 브라우저/기기에서 정상 작동

#### 3.3 성능 최적화
- [ ] 이미지 압축 최적화 (품질 vs 용량)
- [ ] OCR API 호출 최적화 (중복 호출 방지)
- [ ] 컴포넌트 lazy loading
- [ ] 번들 크기 최적화

**산출물**:
- 성능 개선된 앱

**검증 방법**:
- Lighthouse 점수 확인
- 네트워크 탭에서 요청 수/크기 확인

#### 3.4 접근성 및 UX 개선
- [ ] 키보드 네비게이션 테스트
- [ ] ARIA 레이블 추가
- [ ] 색상 대비 확인
- [ ] 로딩 상태 표시 개선
- [ ] 에러 메시지 개선

**산출물**:
- 접근성 및 UX 개선된 앱

**검증 방법**:
- axe DevTools로 접근성 검사
- 스크린 리더 테스트

---

### Phase 4: 문서화 및 배포 준비 (예상: 2-4시간)

#### 4.1 문서화
- [ ] README.md 작성
  - 프로젝트 설명
  - 로컬 개발 방법
  - 환경변수 설정
  - 빌드 및 배포 방법
- [ ] CHANGELOG.md 작성
- [ ] 코드 주석 추가 (복잡한 로직)

**산출물**:
- 완전한 문서

**검증 방법**:
- 다른 개발자가 문서만 보고 로컬 실행 가능

#### 4.2 배포 설정
- [ ] Cloudflare Pages 설정 (또는 다른 호스팅)
- [ ] 프로덕션 환경변수 설정
- [ ] 빌드 스크립트 확인
- [ ] 배포 테스트

**산출물**:
- 프로덕션 배포 가능한 앱

**검증 방법**:
- `pnpm build` 성공
- 배포 후 프로덕션 URL 접속 가능

#### 4.3 Shell 앱 CLAUDE.md 업데이트
- [ ] bookly 앱 정보 추가
- [ ] 프로젝트 구조 다이어그램 업데이트
- [ ] 로컬 테스트 방법 업데이트
- [ ] 배포 URL 구조 업데이트

**산출물**:
- 최신 CLAUDE.md

**검증 방법**:
- CLAUDE.md 내용 확인

---

### Phase 5: 모니터링 및 개선 (지속적)

#### 5.1 사용자 피드백 수집
- [ ] 실제 독서 중 사용 테스트
- [ ] UX 개선 사항 파악

#### 5.2 OCR 정확도 개선
- [ ] 다양한 책 폰트 테스트
- [ ] 이미지 전처리 개선 (대비, 회전 등)

#### 5.3 기능 확장 (옵션)
- [ ] 태그 기능
- [ ] 메모 공유 기능
- [ ] Export 기능 (PDF, TXT)
- [ ] 통계 및 분석 (읽은 책, 메모 수 등)

---

## 10. 기술적 고려사항

### 10.1 이미지 처리

#### 이미지 압축
- **라이브러리**: Canvas API + FileReader
- **목표**: 파일 크기 1MB 이하 (Google Vision API 제한 고려)
- **품질**: JPEG 품질 80-85%
- **해상도**: 최대 2048x2048px (OCR에 충분)

#### 이미지 포맷
- **입력**: JPEG, PNG, WebP
- **변환**: JPEG (Google Vision API 최적)
- **Base64 인코딩**: API 전송용

#### 크롭 영역
- **최소 크기**: 100x100px
- **최대 크기**: 원본 이미지 크기
- ✅ **비율**: 자유 비율 (확정) - 책 문구는 다양한 형태이므로 제약 없음

### 10.2 OCR 처리

#### Google Vision API
- ✅ **언어**: 한글 (ko) + 영어 (en) 혼용 지원 (확정)
- **신뢰도**: 결과에 confidence 포함
- **에러 처리**:
  - 네트워크 에러
  - API 할당량 초과
  - 텍스트 인식 실패

#### OCR 결과 처리
- **텍스트 정리**: 불필요한 공백, 줄바꿈 제거
- **사용자 편집**: 결과를 수정 가능하도록 제공
- **미리보기**: 원본 이미지와 텍스트 나란히 표시

### 10.3 성능 최적화

#### 이미지 업로드
- **Lazy Loading**: 이미지 프리뷰는 필요 시 로드
- **압축**: 업로드 전 클라이언트에서 압축

#### API 호출
- **중복 방지**: 동일 이미지에 대한 중복 OCR 방지
- **캐싱**: 없음 (이미지는 저장하지 않으므로)

#### 번들 크기
- **Code Splitting**: 페이지별 동적 import
- **Tree Shaking**: 사용하지 않는 코드 제거
- **Lazy Loading**: vue-advanced-cropper는 사용 시에만 로드

### 10.4 모바일 최적화

#### 카메라 접근
- **HTML5 Media Capture**: `<input type="file" accept="image/*" capture="environment">`
- **권한 요청**: 카메라 접근 권한 요청 처리

#### 터치 제스처
- **크롭**: 핀치 줌, 드래그로 영역 선택
- **스크롤**: 페이지 스크롤 부드럽게

#### 네트워크
- **오프라인**: 네트워크 에러 시 사용자 안내
- **느린 네트워크**: 로딩 인디케이터 표시

### 10.5 에러 처리

#### 사용자 친화적 메시지
- 네트워크 에러: "인터넷 연결을 확인해주세요"
- OCR 실패: "텍스트를 인식하지 못했습니다. 다시 시도해주세요"
- API 할당량 초과: "일일 사용량이 초과되었습니다"

#### 로깅
- 에러 발생 시 console.error로 로그
- 프로덕션: Sentry 등 에러 트래킹 도입 고려

### 10.6 보안

#### API 키 노출
- **현재**: 프론트엔드에 API 키 노출
- **위험**: API 키 악용 가능
- **완화**:
  - API 키 제한 (도메인, IP)
  - 일일 할당량 설정
  - 비용 알림 설정

#### 대안 (추후 고려)
- Cloudflare Workers로 API 키 은닉
- Supabase Edge Functions 활용

---

## 11. 위험 요소 및 대응방안

### 11.1 기술적 위험

#### 위험 1: OCR 정확도 낮음
**영향**: 사용자 경험 저하, 수동 수정 작업 증가
**확률**: 중
**대응방안**:
- 이미지 전처리 (대비 향상, 노이즈 제거)
- 사용자가 텍스트 수정 가능하도록 UI 제공
- 다양한 책 폰트로 테스트 및 피드백 수집

#### 위험 2: Google Vision API 비용 초과
**영향**: 예상치 못한 비용 발생
**확률**: 낮 (개인 사용)
**대응방안**:
- 일일 할당량 설정 (예: 100회)
- Google Cloud 비용 알림 설정
- 월별 사용량 모니터링

#### 위험 3: API 키 노출 및 악용
**영향**: 비용 급증, 서비스 중단
**확률**: 낮
**대응방안**:
- API 키 도메인/IP 제한
- 일일 할당량 설정
- 주기적으로 키 갱신
- (추후) 서버리스 함수로 은닉

#### 위험 4: 이미지 크기 제한
**영향**: 대용량 이미지 업로드 실패
**확률**: 중
**대응방안**:
- 클라이언트에서 이미지 압축 (1MB 이하)
- 파일 크기 제한 안내 메시지
- 압축 품질 조절 옵션

#### 위험 5: 모바일 브라우저 호환성
**영향**: 특정 브라우저에서 기능 미작동
**확률**: 낮
**대응방안**:
- 주요 브라우저 (iOS Safari, Android Chrome) 테스트
- Polyfill 사용 (필요 시)
- 사용자 에이전트 감지 및 대체 UI 제공

### 11.2 일정 위험

#### 위험 6: 예상보다 긴 개발 시간
**영향**: 출시 지연
**확률**: 중
**대응방안**:
- Phase별 점진적 구현
- MVP 우선 (기본 기능만 먼저 완성)
- 복잡한 기능은 Phase 5로 연기

### 11.3 사용자 경험 위험

#### 위험 7: 모바일 카메라 권한 거부
**영향**: 사용자가 기능 사용 불가
**확률**: 낮
**대응방안**:
- 권한 요청 전 안내 메시지 표시
- 파일 업로드 대체 방법 제공

#### 위험 8: OCR 결과 수정이 번거로움
**영향**: 사용성 저하
**확률**: 중
**대응방안**:
- 직관적인 텍스트 편집 UI
- 드래그 앤 드롭으로 문단 재배치 (선택적)
- 빠른 저장 버튼 제공

---

## 12. 검증 체크리스트

최종 배포 전 확인사항:

- [ ] 모든 요구사항이 명확히 정의되었습니다
- [ ] 기술 접근 방식이 현재 스택과 호환됩니다
- [ ] 작업 계획이 논리적 순서를 따릅니다
- [ ] 의존성이 명확히 문서화되었습니다
- [ ] 성능 고려사항이 반영되었습니다
- [ ] 보안 고려사항이 반영되었습니다
- [ ] 테스트 계획이 포함되었습니다
- [ ] 문서화 요구사항이 포함되었습니다
- [ ] 배포 시 고려사항이 명시되었습니다

---

## 13. 추가 확인 필요 사항 ✅ 모두 결정 완료

다음 사항에 대해 결정되었습니다:

1. ✅ **Google Vision API 키 관리 방식**
   - Cloudflare Workers로 API 키 은닉 (확정)
   - API 키 파일: `underline-project-da29755f69bf.json`

2. ✅ **이미지 크롭 UI/UX**
   - 자유 비율 크롭 (확정)
   - 드래그 앤 드롭 방식

3. ✅ **메모 목록 페이지네이션**
   - 페이지 버튼 방식 (확정)

4. **메모 검색 방식** (기술적 결정 필요)
   - Full-text search (Supabase) 추천
   - 또는 클라이언트 필터링

5. **배포 호스팅** (기존 인프라 활용 예상)
   - Cloudflare Pages (예상)
   - 또는 다른 호스팅 서비스

6. ✅ **OCR 언어 지원**
   - 한글 + 영어 혼용 지원 (확정)

---

## 14. 결론

Bookly 앱은 기존 프로젝트의 아키텍처 패턴(Module Federation, Supabase, Tailwind CSS)을 활용하여 구현 가능한 실용적인 독서 메모 애플리케이션입니다.

**주요 강점**:
- 기존 인프라 재사용 (Supabase, Module Federation)
- 모바일 최적화된 UX
- 관리자만 사용하므로 보안 요구사항 단순화

**주요 과제**:
- Google Vision API 비용 관리
- OCR 정확도 확보
- 모바일 브라우저 호환성

**예상 개발 기간**: 총 24-34시간 (약 3-4주, 파트타임 기준)

---

**문서 버전**: 1.0
**최종 업데이트**: 2025-12-12
**작성자**: Claude Code (Feature Specification Architect)
