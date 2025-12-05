# Jeongwoo.in - 프로젝트 요약
이 문서는 현재 프로젝트의 기술적 현황과 구조의 요약과 향후 과제에 대한 것입니다.

## 기술 스택 적용
- **Module Federation**: @module-federation/vite 1.9.0
- **Vue Router**: 4.4.5
- **Concurrently**: 9.2.1 (병렬 실행)
- **Vue3**: 3.5.13 (기존)
- **TypeScript**: 5.6.3 (기존)
- **Vite**: 6.0.3 (기존)
- **Tailwind CSS**: 3.4.17 (UI 스타일링)


## 프로젝트 구조
```
gongjam-www/
├── apps/
│   ├── _shell/                       # Shell 앱 (Module Federation Host)
│   │   ├── src/
│   │   │   ├── App.vue              # ShellLayout 사용
│   │   │   ├── main.ts              # Vue + Router 초기화
│   │   │   ├── router.ts            # /, /hello, /home, /blog/* 라우트 설정
│   │   │   ├── pages/
│   │   │   │   └── HelloPage.vue    # hello-world federation 로드
│   │   │   ├── __tests__/
│   │   │   │   └── HelloPage.spec.ts
│   │   │   └── style.css
│   │   ├── .env.development         # 로컬 환경변수
│   │   ├── .env.production          # 배포 환경변수
│   │   ├── vite.config.ts           # Module Federation Host 설정
│   │   ├── vitest.config.ts
│   │   ├── package.json
│   │   └── ...
│   │
│   ├── hello-world/                  # Module Federation Remote 앱
│   │   ├── vite.config.ts           # Module Federation Remote 설정
│   │   ├── .env.development
│   │   ├── .env.production
│   │   ├── server/                  # 포트: 3001
│   │   └── ...
│   │
│   ├── guestbook/                    # Module Federation Remote 앱 (방명록)
│   │   ├── src/
│   │   │   ├── App.vue              # 방명록 앱 메인
│   │   │   ├── GuestbookShell.vue   # 방명록 셸 컴포넌트
│   │   │   ├── router.ts            # 방명록 라우터
│   │   │   ├── pages/
│   │   │   │   ├── GuestbookListPage.vue # 방명록 목록 페이지
│   │   │   │   ├── LoginPage.vue         # 로그인 페이지
│   │   │   │   └── GuestbookAdminPage.vue # 관리자 페이지
│   │   │   └── components/
│   │   │       ├── GuestbookCard.vue     # 방명록 카드
│   │   │       ├── GuestbookForm.vue     # 방명록 작성 폼
│   │   │       ├── ProfileSelector.vue   # 프로필 선택
│   │   │       ├── LoginForm.vue         # 로그인 폼
│   │   │       ├── AdminPanel.vue        # 관리자 패널
│   │   │       └── InfiniteScroll.vue    # 무한 스크롤
│   │   ├── vite.config.ts           # Module Federation Remote 설정
│   │   ├── .env.development
│   │   ├── .env.production
│   │   └── ...
│   │
│   └── blog/                         # Module Federation Remote 앱 (블로그)
│       ├── src/
│       │   ├── App.vue              # 블로그 앱 메인
│       │   ├── BlogShell.vue        # 블로그 셸 컴포넌트
│       │   ├── bootstrap.ts         # 부트스트랩 파일
│       │   ├── router.ts            # 블로그 라우터
│       │   ├── pages/
│       │   │   ├── BlogListPage.vue # 블로그 목록 페이지
│       │   │   └── BlogPostPage.vue # 블로그 게시글 페이지
│       │   ├── components/
│       │   │   ├── BlogCard.vue     # 블로그 카드 컴포넌트
│       │   │   ├── BlogTOC.vue      # 목차 컴포넌트
│       │   │   ├── MarkdownRenderer.vue # 마크다운 렌더러
│       │   │   └── TagFilter.vue    # 태그 필터 컴포넌트
│       │   ├── composables/
│       │   │   └── useBlogPosts.ts  # 블로그 포스트 관리 composable
│       │   ├── utils/
│       │   │   ├── markdown.ts      # 마크다운 처리 유틸리티
│       │   │   ├── readingTime.ts   # 읽기 시간 계산
│       │   │   ├── seo.ts           # SEO 유틸리티
│       │   │   └── toc.ts           # 목차 생성 유틸리티
│       │   └── types/
│       │       └── blog.ts          # 블로그 타입 정의
│       ├── posts/                   # 블로그 마크다운 파일
│       ├── scripts/
│       │   ├── build-posts.ts       # 포스트 빌드 스크립트
│       │   ├── generate-sitemap.ts  # 사이트맵 생성 스크립트
│       │   └── upload-sitemap.ts    # 사이트맵 R2 업로드 스크립트
│       ├── vite.config.ts           # Module Federation Remote 설정
│       ├── .env.development
│       ├── .env.production
│       ├── tailwind.config.js       # Tailwind CSS 설정
│       └── ...
│
├── packages/
│   ├── ui/                           # 공통 UI 컴포넌트 패키지
│   │   ├── src/
│   │   │   ├── Button.vue           # 버튼 컴포넌트
│   │   │   ├── ShellLayout.vue      # 공통 레이아웃 컴포넌트
│   │   │   ├── ProfileCard.vue      # 프로필 카드 컴포넌트
│   │   │   ├── ProfileImage.vue     # 프로필 이미지 컴포넌트
│   │   │   ├── __tests__/
│   │   │   │   ├── Button.spec.ts
│   │   │   │   ├── ShellLayout.spec.ts
│   │   │   │   └── ProfileCard.spec.ts
│   │   │   └── index.ts             # 컴포넌트 export
│   │   └── ...
│   ├── vite-config/                  # Vite 공통 설정
│   ├── eslint-config/                # ESLint 공통 설정
│   └── typescript-config/            # TypeScript 공통 설정
│
├── package.json                      # concurrently 추가, dev:all 스크립트
└── turbo.json                        # _shell, hello-world, blog 앱 파이프라인 추가
```

### Module Federation 아키텍처
```
┌─────────────────────────────────────────┐
│         apps/_shell (Host App)          │
│         Port: 3000                      │
│  ┌───────────────────────────────────┐  │
│  │      ShellLayout.vue              │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │   Header (공통 레이아웃)      │  │  │
│  │  └─────────────────────────────┘  │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │   Body (Router Outlet)      │  │  │
│  │  │   ┌─────────────────────┐   │  │  │
│  │  │   │  hello-world 앱     │   │  │  │
│  │  │   │  (Remote Module)    │   │  │  │
│  │  │   │  Routes: /,/hello   │   │  │  │
│  │  │   └─────────────────────┘   │  │  │
│  │  │   ┌─────────────────────┐   │  │  │
│  │  │   │  blog 앱            │   │  │  │
│  │  │   │  (Remote Module)    │   │  │  │
│  │  │   │  Routes: /blog/*    │   │  │  │
│  │  │   └─────────────────────┘   │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
          ↓ (Module Federation)
          ↓ remoteEntry.js
┌─────────────────────────────────────────┐
│    apps/hello-world (Remote App)        │
│    Port: 3001                           │
│  - Exposes: ./App (App.vue)             │
│  - Independent Runtime ✓                │
│  - Shared: vue                          │
└─────────────────────────────────────────┘
          ↓ (Module Federation)
          ↓ remoteEntry.js
┌─────────────────────────────────────────┐
│    apps/blog (Remote App)               │
│    Port: 3002                           │
│  - Exposes: ./BlogShell, ./App,         │
│    ./BlogRouter, ./BlogListPage,        │
│    ./BlogPostPage, ./bootstrap          │
│  - Independent Runtime ✓                │
│  - Shared: vue, vue-router              │
│  - Features: 마크다운 블로그, Tailwind   │
└─────────────────────────────────────────┘
          ↓ (Module Federation)
          ↓ remoteEntry.js
┌─────────────────────────────────────────┐
│    apps/guestbook (Remote App)          │
│    Port: 3003                           │
│  - Exposes: ./GuestbookShell,           │
│    ./GuestbookListPage, ./LoginPage,    │
│    ./GuestbookAdminPage                 │
│  - Independent Runtime ✓                │
│  - Shared: vue, vue-router              │
│  - Features: 방명록, 관리자 패널        │
└─────────────────────────────────────────┘
```

## 주요 설정 파일

### `apps/_shell/vite.config.ts` (Host 설정)
```typescript
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isDevelopment = mode === 'development';

  return {
    plugins: [
      vue(),
      federation({
        name: 'shell',
        remotes: {
          helloWorld: !isDevelopment
            ? `${env.VITE_HELLO_HOME_URL}/hello-world/assets/remoteEntry.js`
            : 'http://localhost:3001/hello-world/assets/remoteEntry.js',
          blog: !isDevelopment
            ? `${env.VITE_BLOG_URL}/remoteEntry.js`
            : 'http://localhost:3002/remoteEntry.js',
        },
        shared: ['vue', 'vue-router'],
      }),
    ],
    server: { port: 3000 },
  };
});
```

### `apps/hello-world/vite.config.ts` (Remote 설정)
```typescript
export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'helloWorld',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.vue'
      },
      shared: ['vue']
    })
  ],
  server: { port: 3001 },
});
```

### `apps/blog/vite.config.ts` (Remote 설정 - Blog)
```typescript
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
        name: 'blog',
        filename: 'remoteEntry.js',
        exposes: {
          './bootstrap': './src/bootstrap.ts',
          './BlogShell': './src/BlogShell.vue',
          './App': './src/App.vue',
          './BlogRouter': './src/router.ts',
          './BlogListPage': './src/pages/BlogListPage.vue',
          './BlogPostPage': './src/pages/BlogPostPage.vue',
        },
        shared: {
          vue: {},
          'vue-router': {},
        },
      }),
    ],
    server: { port: 3002 },
  };
});
```

### `apps/_shell/src/router.ts` (Shell Router 설정)
```typescript
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('helloWorld/App'),
  },
  {
    path: '/hello',
    component: () => import('helloWorld/App'),
  },
  {
    path: '/home',
    component: () => import('helloWorld/App'),
  },
  {
    path: '/blog/:pathMatch(.*)*',
    component: () => import('blog/BlogShell'),
    props: { mode: 'federated', basePath: '/blog' },
  },
];
```

## 로컬 테스트 방법

```bash
# 1. 병렬 실행 (권장)
pnpm dev:all
# Shell (port 3000) + hello-world (port 3001) + blog (port 3002) 동시 실행

# 2. 개별 실행
# Terminal 1: Shell 앱 (Host)
pnpm dev:shell
# 또는
pnpm --filter _shell dev

# Terminal 2: hello-world 앱 (Remote)
pnpm dev:hello
# 또는
pnpm --filter hello-world dev

# Terminal 3: blog 앱 (Remote)
pnpm dev:blog
# 또는
pnpm --filter blog dev
```

## 빌드 및 배포

```bash
# 전체 빌드
pnpm build

# 개별 앱 빌드
pnpm --filter _shell build
pnpm --filter hello-world build
pnpm --filter blog build

# 블로그 사이트맵 생성 및 업로드
pnpm --filter blog build:sitemap     # 사이트맵 생성
pnpm --filter blog upload:sitemap    # 사이트맵 R2 업로드

# 이미지 업로드 (Cloudflare R2)
pnpm upload:image
```

## 배포 URL 구조
- **Shell (Host)**: `https://jeongwoo.in/`
  - 홈: `/`, `/hello`, `/home`
  - 블로그: `/blog/*`
  - 방명록: `/guestbook`
- **hello-world (Remote)**: `https://hello.jeongwoo.in/hello-world/assets/remoteEntry.js`
- **blog (Remote)**: `https://blog.jeongwoo.in/remoteEntry.js`

## 주요 기능

### hello-world 앱
- 간단한 홈 페이지 (인트로)
- Shell의 루트 경로에 마운트

### blog 앱
- 마크다운 기반 블로그 시스템
- Tailwind CSS + @tailwindcss/typography를 이용한 스타일링
- Prism.js를 이용한 코드 하이라이팅 (이전: Shiki)
- 주요 페이지:
  - 블로그 목록 (`/blog`)
  - 블로그 게시글 (`/blog/posts/:slug`)
- 주요 기능:
  - 마크다운 렌더링 (markdown-it)
  - 목차 자동 생성 (TOC)
  - 읽기 시간 계산
  - 태그 필터링
  - SEO 최적화
  - 사이트맵 자동 생성 및 Cloudflare R2 업로드
- 블로그 게시글은 `posts/` 디렉토리에 마크다운 파일로 저장

### guestbook 앱
- 방명록 시스템 (방문자 메시지 작성)
- Tailwind CSS를 이용한 스타일링
- 주요 페이지:
  - 방명록 목록 (`/guestbook`)
  - 로그인 (`/guestbook/login`)
  - 관리자 페이지 (`/guestbook/admin`)
- 주요 기능:
  - 방명록 작성 및 목록 조회
  - 프로필 이미지 선택
  - 무한 스크롤
  - 관리자 인증 및 메시지 관리
  - Cloudflare D1 데이터베이스 연동

## 테스트

```bash
# 전체 테스트 실행
pnpm test

# 개별 앱 테스트
pnpm --filter _shell test
pnpm --filter hello-world test
pnpm --filter blog test

# 블로그 테스트 커버리지
pnpm --filter blog test:coverage

# Watch 모드
pnpm --filter blog test:watch
```

## 코드 품질

```bash
# Lint 검사
pnpm lint

# Type 체크
pnpm type-check

# 코드 포맷팅
pnpm format

# 포맷팅 검사
pnpm format:check
```

## 향후 확장 계획
- [x] 홈 화면의 더미내용을 실제로 변경
- [x] 파비콘 만들기
- [x] 게스트북 (방명록) 페이지 추가
- [x] 사이트맵 자동 업로드 (Cloudflare R2)
- [x] 다크모드 지원
- [x] 사이트맵 검색엔진 제출
- [ ] 블로그의 좋아요 기능 추가
- [ ] 블로그 검색 기능 추가
- [ ] 블로그의 태그 기능 완성
- [ ] 블로그의 관련글 기능 추가

### 블로그 글 계획
- 

## 주요 의존성

### 공통
- **Vue**: 3.5.13
- **Vue Router**: 4.4.5
- **TypeScript**: 5.6.3
- **Vite**: 6.0.3
- **Vitest**: 3.2.4 (테스팅)

### Blog 앱 전용
- **markdown-it**: 14.1.0 (마크다운 파싱)
- **prismjs**: 1.30.0 (코드 하이라이팅)
- **markdown-it-prism**: 3.0.1 (마크다운 코드 하이라이팅 플러그인)
- **gray-matter**: 4.0.3 (frontmatter 파싱)
- **date-fns**: 4.1.0 (날짜 포맷팅)
- **reading-time**: 1.5.0 (읽기 시간 계산)
- **@aws-sdk/client-s3**: 3.x (Cloudflare R2 업로드)

### Guestbook 앱 전용
- **date-fns**: 4.1.0 (날짜 포맷팅)

### 추가 도구
- **sharp**: 0.34.5 (이미지 처리 - 파비콘 생성)

**최종 업데이트**: 2025-12-06
**작성자**: Claude Code
