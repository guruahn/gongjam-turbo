# Vue3 Monorepo Foundation - Phase 진행 상황

## Phase 1: 기본 인프라 구성 ✅ (완료)

**완료일**: 2025-10-13

### 완료 항목
- ✅ Turborepo 초기화 및 설정
- ✅ pnpm workspace 구성
- ✅ TypeScript 엄격 모드 설정
- ✅ ESLint + Prettier 기본 설정
- ✅ packages/typescript-config 구성
- ✅ packages/eslint-config 구성

### 검증 결과
- ✅ Turborepo 명령어 정상 실행 (`pnpm turbo build`)
- ✅ TypeScript 컴파일 오류 없음
- ✅ ESLint 검사 통과

---

## Phase 2: 공통 컴포넌트 구성 ✅ (완료)

**완료일**: 2025-10-13

### 완료 항목

#### 1. packages/ui - 공통 UI 컴포넌트 패키지
- ✅ Vue3 + TypeScript 기반 패키지 구조
- ✅ Button.vue 컴포넌트 구현
  - TypeScript로 타입 안전성 확보
  - Tailwind CSS 스타일링
  - 기본 클릭 이벤트 처리
- ✅ vite-plugin-dts를 사용한 타입 선언 파일 자동 생성
- ✅ 패키지 빌드 및 export 구조

#### 2. packages/vite-config - 공통 Vite 설정
- ✅ Vue3 앱을 위한 재사용 가능한 Vite 설정
- ✅ 기본 개발 서버 설정 (port 3000)

#### 3. apps/hello-world - Hello World 애플리케이션
- ✅ Vue3 + Vite 기반 앱 구조
- ✅ Tailwind CSS 설정 (postcss, autoprefixer)
- ✅ @gongjam/ui 패키지의 Button 컴포넌트 사용
- ✅ "Hello World" 메시지와 버튼 표시
- ✅ 버튼 클릭 시 alert 동작

### 기술 스택 적용
- **Vue3**: 3.5.13
- **TypeScript**: 5.6.3 (엄격 모드)
- **Vite**: 6.0.3
- **Tailwind CSS**: 3.4.17
- **vite-plugin-dts**: 4.4.1 (타입 선언 자동 생성)

### 검증 결과
- ✅ `pnpm turbo build` 성공
  - @gongjam/ui 패키지 빌드 성공
  - hello-world 앱 빌드 성공
- ✅ `pnpm turbo type-check` 성공
  - TypeScript 타입 체크 통과
  - vue-tsc 호환성 문제 해결 (tsconfig.json 최적화)
- ✅ Button 컴포넌트 타입 선언 파일 생성 확인
- ✅ 패키지 간 의존성 정상 동작

### 프로젝트 구조
```
gongjam-www/
├── apps/
│   └── hello-world/              # Hello World 앱
│       ├── src/
│       │   ├── App.vue          # Button 컴포넌트 사용
│       │   ├── main.ts
│       │   └── style.css        # Tailwind CSS
│       ├── dist/                # 빌드 산출물
│       ├── index.html
│       ├── package.json
│       ├── vite.config.ts
│       ├── tsconfig.json
│       ├── tailwind.config.js
│       └── postcss.config.js
├── packages/
│   ├── ui/                       # 공통 UI 컴포넌트
│   │   ├── src/
│   │   │   ├── Button.vue       # 심플한 버튼 컴포넌트
│   │   │   └── index.ts         # Export
│   │   ├── dist/                # 빌드 산출물 + 타입 선언
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   ├── vite-config/              # Vite 공통 설정
│   │   ├── base.ts
│   │   └── package.json
│   ├── eslint-config/            # ESLint 공통 설정
│   └── typescript-config/        # TypeScript 공통 설정
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── .claude/
    ├── spec-vue3-monorepo-foundation.md
    └── CLAUDE.md (이 파일)
```

### 해결한 기술적 이슈
1. **vue-tsc 호환성 문제**
   - 문제: vue-tsc --declaration 실행 시 `Cannot read properties of undefined (reading 'fileName')` 에러
   - 해결: vite-plugin-dts 사용으로 변경하여 타입 선언 자동 생성

2. **TypeScript 설정 최적화**
   - composite: false로 설정 (monorepo 구조에서 불필요)
   - lib: ["ESNext", "DOM"] 명시적 추가
   - skipLibCheck: true 설정

### 로컬 테스트 방법
```bash
# Hello World 앱 실행
pnpm --filter hello-world dev

# 브라우저에서 http://localhost:3000 접속
# "Hello World" 텍스트와 파란색 버튼 확인
# 버튼 클릭 시 alert 메시지 확인
```

---

## Phase 3: 자동화 파이프라인 ✅ (완료)

**완료일**: 2025-10-13

### 완료 항목

#### 1. 테스트 환경 구성 (Vitest)
- ✅ Vitest + @vue/test-utils + happy-dom 설치
- ✅ packages/ui Vitest 설정
  - vitest.config.ts 생성
  - Button.vue 단위 테스트 작성 (6개 테스트 케이스)
  - 모든 함수 레벨 테스트 작성
- ✅ apps/hello-world Vitest 설정
  - vitest.config.ts 생성
  - App.vue 컴포넌트 테스트 작성 (5개 테스트 케이스)
  - 통합 테스트 (Button 컴포넌트 연동)
- ✅ Turborepo test 파이프라인 통합

#### 2. CloudFlare Pages 배포 설정
- ✅ wrangler.toml 설정 파일 생성
  - 프로젝트명: gongjam-hello-world
  - 빌드 출력 디렉토리: dist
  - 커스텀 도메인: jeongwoo.in/hello (설정 필요)
- ✅ DEPLOYMENT.md 배포 가이드 작성
  - 수동 배포 방법 (Wrangler CLI)
  - GitHub 연동 자동 배포 설정
  - 커스텀 도메인 구성 방법
  - 트러블슈팅 가이드

#### 3. CI/CD 파이프라인 구축
- ✅ GitHub Actions 워크플로우 생성
  - 품질 검사: lint + type-check + test + build
  - Node.js 22.11.0 환경
  - pnpm 캐싱으로 빌드 속도 최적화
  - main/develop 브랜치에서 자동 실행
  - Pull Request 시 자동 검증
  - 빌드 아티팩트 업로드 (7일 보관)

### 기술 스택 적용
- **Testing**: Vitest 3.2.4
- **Test Utils**: @vue/test-utils 2.4.6
- **Test Environment**: happy-dom 20.0.0
- **Deployment**: CloudFlare Pages + Wrangler
- **CI/CD**: GitHub Actions

### 검증 결과
- ✅ `pnpm turbo test` 성공
  - packages/ui: 6개 테스트 통과
  - apps/hello-world: 5개 테스트 통과
  - 총 11개 테스트 케이스 모두 통과
- ✅ 모든 함수에 대한 단위 테스트 작성 완료
- ✅ CloudFlare Pages 설정 파일 준비 완료
- ✅ GitHub Actions CI 워크플로우 준비 완료

### 프로젝트 구조 (업데이트)
```
gongjam-www/
├── .github/
│   └── workflows/
│       └── ci.yml                   # CI/CD 파이프라인
├── apps/
│   └── hello-world/
│       ├── src/
│       │   ├── __tests__/
│       │   │   └── App.spec.ts      # App 컴포넌트 테스트
│       │   ├── App.vue
│       │   └── main.ts
│       ├── vitest.config.ts         # Vitest 설정
│       ├── wrangler.toml            # CloudFlare Pages 설정
│       └── DEPLOYMENT.md            # 배포 가이드
├── packages/
│   ├── ui/
│   │   ├── src/
│   │   │   ├── __tests__/
│   │   │   │   └── Button.spec.ts  # Button 컴포넌트 테스트
│   │   │   └── Button.vue
│   │   └── vitest.config.ts        # Vitest 설정
│   └── ...
└── ...
```

### 테스트 커버리지
#### packages/ui/Button.vue
- ✅ 슬롯 컨텐츠 렌더링
- ✅ 기본 type prop (button)
- ✅ type prop 적용 (submit/reset)
- ✅ 클릭 이벤트 emit
- ✅ MouseEvent 전달
- ✅ CSS 클래스 적용

#### apps/hello-world/App.vue
- ✅ "Hello World" 헤딩 렌더링
- ✅ Button 컴포넌트 렌더링
- ✅ Button 텍스트 확인
- ✅ 버튼 클릭 시 alert 호출
- ✅ 레이아웃 구조 검증

### 해결한 기술적 이슈
1. **jsdom 호환성 문제**
   - 문제: jsdom 27.0.0에서 `Cannot read properties of undefined (reading 'get')` 에러
   - 해결: happy-dom 20.0.0으로 전환 (Vitest와 호환성 우수)

### CI/CD 워크플로우
```yaml
Trigger: Push to main/develop, Pull Request
├─ Setup: Node.js 22.11.0 + pnpm 8.15.6
├─ Cache: pnpm store
├─ Install: pnpm install --frozen-lockfile
├─ Lint: pnpm turbo lint
├─ Type-check: pnpm turbo type-check
├─ Test: pnpm turbo test
├─ Build: pnpm turbo build
└─ Upload: Build artifacts (7 days)
```

### 배포 방법
```bash
# 로컬 테스트
pnpm --filter hello-world test
pnpm --filter hello-world build
pnpm --filter hello-world preview

# CloudFlare Pages 배포
cd apps/hello-world
wrangler pages deploy dist --project-name=gongjam-hello-world

# GitHub 연동 시 자동 배포 (main 브랜치)
```

### 다음 단계
- [ ] CloudFlare Pages 프로젝트 생성 및 GitHub 연동
- [ ] 커스텀 도메인 jeongwoo.in/hello 설정
- [ ] Production 환경 첫 배포 및 검증
- [ ] 추가 앱 및 컴포넌트 개발

---

## Phase 4: Module Federation 마이크로 아키텍처 ✅ (완료)

**완료일**: 2025-10-14

### 완료 항목

#### 1. Shell 앱 구축 (`apps/_shell`)
- ✅ Module Federation Host 앱 구조 생성
- ✅ Vue Router 통합 (라우트 기반 앱 로드)
- ✅ ShellLayout 컴포넌트 통합 (공통 레이아웃)
- ✅ 환경변수 기반 Remote URL 관리
- ✅ Vite Module Federation 플러그인 설정

#### 2. Module Federation 설정
- ✅ `@originjs/vite-plugin-federation` 패키지 통합
- ✅ Shell 앱: Module Federation Host 설정
  - `apps/_shell/vite.config.ts` - remotes 설정
  - hello-world 앱을 `helloWorld` remote로 등록
  - 공유 의존성: vue, vue-router
- ✅ hello-world 앱: Module Federation Remote 설정
  - `apps/hello-world/vite.config.ts` - exposes 설정
  - App.vue를 `./App` 경로로 expose
  - 포트 변경 (3000 → 3001)

#### 3. 공통 레이아웃 컴포넌트
- ✅ `packages/ui/src/ShellLayout.vue` 생성
  - Header + Body 구조
  - Tailwind CSS 스타일링
  - Slot 기반 컨텐츠 주입
- ✅ ShellLayout 단위 테스트 작성 및 통과
- ✅ packages/ui에서 ShellLayout export

#### 4. 라우팅 구조
- ✅ Shell 앱 라우터 설정
  - `/` → `/hello` 리다이렉트
  - `/hello` → HelloPage.vue (Module Federation 로드)
- ✅ HelloPage.vue 컴포넌트
  - defineAsyncComponent로 hello-world 앱 동적 로드
  - Suspense를 통한 로딩 상태 처리
- ✅ HelloPage 통합 테스트 작성 및 통과

#### 5. 개발 환경 설정
- ✅ 병렬 실행 스크립트 구성
  - `concurrently` 패키지 설치
  - `dev:all` 스크립트 (Shell + hello-world 동시 실행)
  - 로그 prefix 구분 ([shell], [hello])
- ✅ 환경변수 파일 설정
  - `.env.development` (로컬: localhost:3001)
  - `.env.production` (배포: CloudFlare Pages URL)

### 기술 스택 적용
- **Module Federation**: @originjs/vite-plugin-federation 1.4.1
- **Vue Router**: 4.4.5
- **Concurrently**: 9.1.0 (병렬 실행)
- **Vue3**: 3.5.13 (기존)
- **TypeScript**: 5.6.3 (기존)
- **Vite**: 6.0.3 (기존)

### 검증 결과
- ✅ `pnpm dev:all` 성공
  - Shell 앱 (port 3000) + hello-world 앱 (port 3001) 동시 실행
- ✅ `http://localhost:3000/hello` 접속 확인
  - ShellLayout 헤더 렌더링
  - hello-world 앱 Module Federation 로드 성공
- ✅ hello-world 앱 독립 실행 유지
  - `pnpm --filter hello-world dev` 정상 동작 (port 3001)
- ✅ 모든 테스트 통과
  - packages/ui: ShellLayout 테스트 통과
  - apps/_shell: HelloPage 테스트 통과
  - apps/hello-world: 기존 테스트 유지
- ✅ TypeScript 타입 체크 통과
- ✅ 빌드 성공 (`pnpm turbo build`)

### 프로젝트 구조 (업데이트)
```
gongjam-www/
├── apps/
│   ├── _shell/                       # Shell 앱 (Module Federation Host)
│   │   ├── src/
│   │   │   ├── App.vue              # ShellLayout 사용
│   │   │   ├── main.ts              # Vue + Router 초기화
│   │   │   ├── router.ts            # /hello 라우트 설정
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
│   └── hello-world/                  # Module Federation Remote 앱
│       ├── vite.config.ts           # Module Federation Remote 설정
│       ├── .env.development
│       ├── .env.production
│       └── ...
│
├── packages/
│   ├── ui/
│   │   ├── src/
│   │   │   ├── Button.vue
│   │   │   ├── ShellLayout.vue      # 공통 레이아웃 컴포넌트
│   │   │   ├── __tests__/
│   │   │   │   ├── Button.spec.ts
│   │   │   │   └── ShellLayout.spec.ts
│   │   │   └── index.ts             # ShellLayout export 추가
│   │   └── ...
│   └── ...
│
├── package.json                      # concurrently 추가, dev:all 스크립트
└── turbo.json                        # _shell 앱 파이프라인 추가
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
```

### 주요 설정 파일

#### `apps/_shell/vite.config.ts` (Host 설정)
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
        },
        shared: ['vue', 'vue-router'],
      }),
    ],
    server: { port: 3000 },
  };
});
```

#### `apps/hello-world/vite.config.ts` (Remote 설정)
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
  server: { port: 3001 }, // 포트 변경
});
```

#### `apps/_shell/src/pages/HelloPage.vue`
```vue
<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const HelloWorldApp = defineAsyncComponent(
  () => import('helloWorld/App')
)
</script>

<template>
  <div class="hello-page">
    <Suspense>
      <HelloWorldApp />
    </Suspense>
  </div>
</template>
```

### 테스트 커버리지

#### packages/ui/ShellLayout.vue
- ✅ 헤더 렌더링 ("this is header")
- ✅ 슬롯 컨텐츠 렌더링
- ✅ CSS 클래스 적용 (min-h-screen, bg-blue-600)

#### apps/_shell/HelloPage.vue
- ✅ hello-page 컨테이너 렌더링
- ✅ Suspense 컴포넌트 포함
- ✅ Module Federation 로드 (mocked)

### 해결한 기술적 이슈

1. **Module Federation Remote URL 관리**
   - 문제: 개발/배포 환경별 URL 관리 필요
   - 해결: 환경변수 기반 동적 URL 설정
     - Development: `http://localhost:3001`
     - Production: `${VITE_HELLO_HOME_URL}`

2. **타입 안전성 확보**
   - 문제: Module Federation import에 TypeScript 타입 없음
   - 해결: `vite-env.d.ts`에 타입 선언 추가
   ```typescript
   declare module 'helloWorld/App' {
     import { DefineComponent } from 'vue'
     const component: DefineComponent<{}, {}, any>
     export default component
   }
   ```

3. **독립 실행 유지**
   - 문제: hello-world 앱이 Shell에만 의존하면 안됨
   - 해결: Remote 설정만 추가하고 독립 실행 구조 유지
   - 검증: `pnpm --filter hello-world dev` 정상 동작

### 로컬 테스트 방법

```bash
# 1. 병렬 실행 (권장)
pnpm dev:all
# Shell (port 3000) + hello-world (port 3001) 동시 실행
# http://localhost:3000/hello 접속

# 2. 개별 실행
# Terminal 1: hello-world 앱 (Remote)
pnpm --filter hello-world dev

# Terminal 2: Shell 앱 (Host)
pnpm --filter _shell dev

# 3. hello-world 독립 실행
pnpm --filter hello-world dev
# http://localhost:3001 접속
```

### 배포 전략

#### CloudFlare Pages 배포 순서
1. **hello-world 앱 먼저 배포** (Remote App)
   ```bash
   cd apps/hello-world
   pnpm build
   wrangler pages deploy dist --project-name=gongjam-hello-world
   # remoteEntry.js 생성: /assets/remoteEntry.js
   ```

2. **_shell 앱 배포** (Host App)
   ```bash
   cd apps/_shell
   pnpm build
   wrangler pages deploy dist --project-name=gongjam-shell
   ```

3. **환경변수 설정** (CloudFlare Pages)
   ```
   VITE_HELLO_HOME_URL=https://gongjam-hello-world.pages.dev
   ```

#### 배포 URL 구조
- **hello-world**: `https://gongjam-hello-world.pages.dev`
- **Shell**: `https://gongjam-shell.pages.dev/hello`
- **remoteEntry.js**: `https://gongjam-hello-world.pages.dev/assets/remoteEntry.js`

### 향후 확장 계획
- [ ] 추가 마이크로 앱 통합 (/dashboard, /admin)
- [ ] 공통 네비게이션 메뉴 구현
- [ ] 에러 바운더리 추가 (Remote 로드 실패 처리)
- [ ] 성능 모니터링 (Module Federation 로드 시간)
- [ ] CI/CD 자동 배포 파이프라인 구축

---

## Phase 5: 프로필 페이지 및 레이아웃 완성 ✅ (완료)

**완료일**: 2025-10-31

### 완료 항목

#### 1. ShellLayout 전면 개선 (`packages/ui/src/ShellLayout.vue`)
- ✅ **네비게이션 바 구현**
  - 로고/타이틀: "Jeongwoo Ahn" (홈 링크)
  - 메뉴: Hello, Blog, GuestBook (router-link 연결)
  - 다크모드 토글 버튼 (moon ☀️/sun 🌙 아이콘)
  - 모바일 반응형: 햄버거 메뉴 (☰/✕)
  - 활성 라우트 하이라이트

- ✅ **다크모드 시스템**
  - localStorage 기반 테마 저장 (`theme: 'light' | 'dark'`)
  - 시스템 선호도 자동 감지 (`prefers-color-scheme`)
  - HTML 문서에 `dark` 클래스 토글
  - 전역 적용 (모든 마이크로 앱에 영향)

- ✅ **푸터 구현**
  - 소셜 링크: GitHub 🐙, Email 📧
  - 저작권 표시: "Copyright © 2025 • Jeongwoo Ahn"
  - 중앙 정렬, 다크모드 스타일 지원

#### 2. ProfileImage 컴포넌트 (`packages/ui/src/ProfileImage.vue`)
- ✅ 새로운 공통 컴포넌트 생성
  - Props: `size` (small/medium/large/custom), `customClass`
  - 프로필 이미지 asset 통합 (`assets/my-face-transparent.png`)
  - Tailwind CSS 기반 스타일링 (원형, 반응형 크기)
  - TypeScript 타입 안전성 확보
- ✅ `packages/ui/src/index.ts`에서 export
- ✅ 다른 앱에서 재사용 가능 (`import { ProfileImage } from '@gongjam/ui'`)

#### 3. hello-world 앱 프로필 페이지 전면 재구성
- ✅ **App.vue 완전 개편**
  - 기존: 단순 "Hello World" 텍스트와 버튼
  - 신규: 전문적인 프로필/포트폴리오 페이지

- ✅ **2열 반응형 레이아웃**
  - Desktop (lg:): 3열 그리드 (1/3 프로필 카드 + 2/3 메인 콘텐츠)
  - Mobile/Tablet: 1열 스택 레이아웃

- ✅ **프로필 카드 (왼쪽 섹션)**
  - ProfileImage 컴포넌트 통합 (large 사이즈, 140x140px)
  - 이름: "Jeongwoo Ahn" (h1, 볼드)
  - 직함: "Full Stack Developer"
  - 연락처 정보:
    * 📧 Email: guruahn@gmail.com (mailto 링크)
    * 📍 Location: Seoul, South Korea
    * 🐙 GitHub: github.com/guruahn (외부 링크)
  - 카드 스타일: 흰색/회색 배경, 그림자, 둥근 모서리
  - sticky positioning (상단 고정)

- ✅ **메인 콘텐츠 (오른쪽 섹션)**
  - **인사말 섹션**
    * 제목: "👋 Hola, Good Day!" (h2, 4xl)
    * 자기소개 텍스트 (full-stack developer, Vue.js 전문)

  - **기술 스택 섹션**
    * 제목: "🛠️ Tech Stack"
    * Frontend: Vue, React, TypeScript, Tailwind CSS
    * Backend: Node.js, Python, PostgreSQL, Redis
    * 배지 스타일 태그 (blue-100/blue-900)

  - **포트폴리오 타임라인**
    * 제목: "💼 Experience & Portfolio"
    * 4개 경력/프로젝트 항목:
      1. Senior Software Engineer at Tech Company (2020-Present)
      2. Full Stack Developer at Startup (2018-2020)
      3. Open Source Contributions (2017-Present)
      4. Computer Science Degree (2014-2018)
    * 각 항목: 아이콘, 제목, 기간, 설명, 기술 스택 태그
    * 타임라인 스타일: 왼쪽 파란색 세로선, 원형 아이콘 마커

- ✅ **TypeScript 데이터 구조**
  - `PortfolioItem` interface (id, icon, title, link, period, description, tags)
  - `TechCategory` interface (name, items)
  - 타입 안전성 확보

#### 4. 다크모드 전역 설정
- ✅ `apps/_shell/tailwind.config.js`에 `darkMode: 'class'` 추가
- ✅ `apps/hello-world/tailwind.config.js`에 `darkMode: 'class'` 추가
- ✅ 모든 컴포넌트에 `dark:` variant 클래스 적용
  - 배경: `dark:bg-gray-800`, `dark:bg-gray-900`
  - 텍스트: `dark:text-white`, `dark:text-gray-300`
  - 테두리: `dark:border-gray-700`
  - 액센트: `dark:text-blue-400`, `dark:bg-blue-900`

#### 5. 라우팅 확장
- ✅ `apps/_shell/src/router.ts`에 `/home` 라우트 추가
  - `/`, `/hello`, `/home` 모두 hello-world 앱으로 라우팅
  - Module Federation 동적 로드 유지

### 기술 스택 추가/업데이트
- **기존 유지**: Vue3 3.5.13, TypeScript 5.6.3, Tailwind CSS 3.4.17
- **다크모드**: Tailwind CSS `darkMode: 'class'` + localStorage
- **에셋 관리**: Vite asset import (`import from './assets/*.png'`)
- **vue-router**: 4.4.5 (기존)

### 검증 결과
- ✅ `pnpm turbo build` 성공
  - packages/ui 빌드 (ProfileImage 포함)
  - apps/_shell 빌드
  - apps/hello-world 빌드
- ✅ `pnpm turbo type-check` 성공
  - 모든 TypeScript 타입 검증 통과
  - ProfileImage, App.vue 인터페이스 타입 안전성 확보
- ✅ ShellLayout 테스트 존재 (`packages/ui/src/__tests__/ShellLayout.spec.ts`)
- ✅ 다크모드 동작 확인 (localStorage 저장/로드)

### 프로젝트 구조 (업데이트)
```
gongjam-www/
├── .claude/
│   ├── CLAUDE.md (이 파일)
│   └── spec-20251020-hello-world-redesign.md  # 기획 스펙
├── apps/
│   ├── _shell/
│   │   ├── src/
│   │   │   ├── App.vue                        # ShellLayout 사용
│   │   │   ├── router.ts                      # /, /hello, /home 라우트
│   │   │   └── ...
│   │   └── tailwind.config.js                 # darkMode: 'class' ✨
│   │
│   └── hello-world/
│       ├── src/
│       │   ├── App.vue                        # 프로필 페이지 ✨ 전면 개편
│       │   └── ...
│       └── tailwind.config.js                 # darkMode: 'class' ✨
│
├── packages/
│   └── ui/
│       ├── src/
│       │   ├── Button.vue
│       │   ├── ShellLayout.vue                # ✨ 네비+푸터+다크모드 완성
│       │   ├── ProfileImage.vue               # ✨ 신규 컴포넌트
│       │   ├── assets/
│       │   │   └── my-face-transparent.png    # ✨ 프로필 이미지
│       │   ├── __tests__/
│       │   │   ├── Button.spec.ts
│       │   │   └── ShellLayout.spec.ts        # ✨ 네비/다크모드 테스트
│       │   └── index.ts                       # ProfileImage export ✨
│       └── ...
└── ...
```

### 주요 기능 및 동작

#### 다크모드 작동 방식
```typescript
// ShellLayout.vue
const isDarkMode = ref<boolean>(false);

// 초기화: localStorage 또는 시스템 선호도
const initializeDarkMode = (): void => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    isDarkMode.value = savedTheme === 'dark';
  } else {
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  applyDarkMode();
};

// 토글: localStorage 저장 + HTML 클래스 적용
const toggleDarkMode = (): void => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
  document.documentElement.classList.toggle('dark');
};
```

#### 라우팅 구조
```typescript
// apps/_shell/src/router.ts
const routes: RouteRecordRaw[] = [
  { path: '/', component: () => import('helloWorld/App') },
  { path: '/hello', component: () => import('helloWorld/App') },
  { path: '/home', component: () => import('helloWorld/App') },  // ✨ 신규
];
```

#### ProfileImage 사용 예시
```vue
<!-- apps/hello-world/src/App.vue -->
<script setup lang="ts">
import { ProfileImage } from '@gongjam/ui';
</script>

<template>
  <ProfileImage size="large" custom-class="w-40 h-40" />
</template>
```

### 해결한 기술적 이슈

1. **Asset Import 경로 관리**
   - 문제: ProfileImage에서 로컬 이미지 asset 참조
   - 해결: Vite의 asset import 사용 (`import profileImage from './assets/*.png'`)
   - 빌드 시 asset이 dist에 자동 포함됨

2. **다크모드 전역 적용**
   - 문제: Module Federation 구조에서 다크모드 상태 공유
   - 해결: HTML 문서 레벨 (`document.documentElement`)에 `dark` 클래스 적용
   - 모든 마이크로 앱이 동일한 DOM 트리 공유 → 다크모드 자동 적용

3. **모바일 햄버거 메뉴 라우팅**
   - 문제: 모바일 메뉴 클릭 시 메뉴 닫히지 않음
   - 해결: `watch(() => router.currentRoute.value.path)`로 라우트 변경 감지
   - 라우트 변경 시 자동으로 모바일 메뉴 닫기

### 로컬 테스트 방법

```bash
# 전체 앱 실행 (권장)
pnpm dev:all
# Shell (port 5173) + hello-world (port 3000) 동시 실행
# http://localhost:5173 접속 (또는 _shell 앱 포트)

# 라우트 테스트
# http://localhost:5173/ → 프로필 페이지
# http://localhost:5173/hello → 동일 페이지
# http://localhost:5173/home → 동일 페이지

# 다크모드 테스트
# 1. 우측 상단 다크모드 토글 클릭 (🌙/☀️)
# 2. 전체 페이지 다크모드 전환 확인
# 3. localStorage 확인: 개발자 도구 > Application > Local Storage > theme
# 4. 페이지 새로고침 → 테마 유지 확인

# 반응형 테스트
# 개발자 도구 > 반응형 디자인 모드
# - Mobile (< 768px): 1열, 햄버거 메뉴
# - Desktop (> 1024px): 2열 그리드
```

### 화면 구성 (Desktop)
```
┌──────────────────────────────────────────────────────┐
│ Jeongwoo Ahn    Hello  Blog  GuestBook      🌙      │ ← ShellLayout Nav
├──────────────────────────────────────────────────────┤
│  ┌───────────┐  ┌───────────────────────────────┐   │
│  │ Profile   │  │  👋 Hola, Good Day!           │   │
│  │  Card     │  │  I'm a passionate...          │   │
│  │           │  │                                │   │
│  │ [Image]   │  │  🛠️ Tech Stack                │   │
│  │  Name     │  │  Frontend: [Vue][React]...    │   │
│  │  Email    │  │  Backend: [Node.js]...        │   │
│  │  GitHub   │  │                                │   │
│  │           │  │  💼 Experience & Portfolio    │   │
│  └───────────┘  │  • Senior Engineer (2020-)    │   │
│                 │  • Developer (2018-2020)      │   │
│                 │  • Open Source (2017-)        │   │
│                 │  • CS Degree (2014-2018)      │   │
│                 └───────────────────────────────┘   │
├──────────────────────────────────────────────────────┤
│      🐙  📧          © 2025 Jeongwoo Ahn            │ ← ShellLayout Footer
└──────────────────────────────────────────────────────┘
```

### 참고 자료
- 기획 스펙: `.claude/spec-20251020-hello-world-redesign.md`
- 참고 디자인: https://nuxt-tailwind-blog.netlify.app/
- Tailwind Dark Mode: https://tailwindcss.com/docs/dark-mode

### 향후 확장 계획
- [x] Blog 페이지 구현 (/blog 라우트 활성화) - Phase 6 완료
- [ ] GuestBook 페이지 구현 (/guest-book 라우트 활성화)
- [ ] ProfileImage 테스트 작성 (`ProfileImage.spec.ts`)
- [ ] hello-world App.vue 테스트 업데이트 (프로필 페이지 렌더링 검증)
- [ ] 추가 마이크로 앱 통합 (다른 기능 모듈)
- [ ] 애니메이션 효과 (스크롤 애니메이션, 트랜지션)
- [x] SEO 메타 태그 추가 - Phase 6 완료
- [ ] CloudFlare Pages 배포 및 검증

---

## Phase 6: 블로그 시스템 SEO 및 사이트맵 ✅ (완료)

**완료일**: 2025-11-07

### 완료 항목
- ✅ **사이트맵 생성 시스템** (`scripts/generate-sitemap.ts`)
  - posts.json 기반 자동 sitemap.xml 생성 (11 URLs)
  - 환경변수 기반 URL 관리 (development/production)
  - 빌드 스크립트 통합 (`build:sitemap`)

- ✅ **SEO 메타 태그 시스템** (`src/utils/seo.ts`)
  - useHead Composable 구현 (Open Graph, Twitter Card)
  - Article 메타 태그 지원 (author, published_time, tags)
  - BlogPostPage, BlogListPage 동적 메타 태그 적용

- ✅ **robots.txt 생성**
  - 검색 엔진 크롤링 허용
  - Sitemap 위치 명시

- ✅ **TypeScript 타입 안전성**
  - tsconfig.json 최적화 (resolveJsonModule, exactOptionalPropertyTypes)
  - markdown-it-attrs 타입 선언 추가

### 기술 스택
- sitemap 8.0.0, Vue3 Composables, TypeScript strict mode

### 검증 결과
- ✅ sitemap.xml 생성 (11 URLs: 목록 1 + 글 3 + 태그 7)
- ✅ TypeScript 타입 체크 통과
- ✅ 빌드 성공 (dist/sitemap.xml, dist/robots.txt)

### 주요 해결 이슈
- JSON Module Import 타입 에러 → resolveJsonModule: true
- SPA 환경 메타 태그 관리 → onMounted/onUnmounted DOM 조작
- markdown-it-attrs 타입 선언 추가

---

## Phase 7: Testing and Quality Assurance ✅ (완료)

**완료일**: 2025-11-07

### 완료 항목
- ✅ **테스트 환경 구성**
  - Vitest 3.2.4 + @vue/test-utils 2.4.6 + happy-dom 20.0.0
  - Coverage provider: @vitest/coverage-v8 3.2.4

- ✅ **11개 테스트 파일 작성 (133 tests)**
  - **Utils (4개)**: readingTime (13), toc (16), seo (11), markdown (13)
  - **Composables (1개)**: useBlogPosts (17)
  - **Components (4개)**: BlogCard (10), TagFilter (9), MarkdownRenderer (11), BlogTOC (13)
  - **Pages (2개)**: BlogListPage (9), BlogPostPage (11)

### 검증 결과
- ✅ **133개 테스트 모두 통과** (Duration: ~3.5초)
- ✅ **코드 커버리지 77.32% 달성**
  - Components: 93.38%
  - Composables: 100%
  - Pages: 99.51%
  - Utils: 94.94%

### 주요 해결 이슈
- Vue Lifecycle Hook Context → Test 컴포넌트로 composable wrapping
- IntersectionObserver 미지원 → global mock class 할당
- Shiki 성능 이슈 → vi.mock으로 mocking하여 테스트 속도 개선

---

**최종 업데이트**: 2025-11-07
**작성자**: Claude Code
