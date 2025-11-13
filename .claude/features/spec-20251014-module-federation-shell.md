# Module Federation Shell - Feature Specification

**Feature Name**: `module-federation-shell`
**Feature Description**: Add Shell App with Module Federation for Micro-Frontend Architecture
**작성일**: 2025-10-14
**상태**: Specification Ready

---

## 📋 목차

1. [Feature 개요](#feature-개요)
2. [문제 정의](#문제-정의)
3. [해결 방안](#해결-방안)
4. [기술 스택](#기술-스택)
5. [프로젝트 구조](#프로젝트-구조)
6. [상세 작업 계획](#상세-작업-계획)
7. [테스트 전략](#테스트-전략)
8. [배포 전략](#배포-전략)
9. [기술적 제약사항](#기술적-제약사항)
10. [검증 방법](#검증-방법)

---

## Feature 개요

### 🎯 목표
기존 모노레포 구조에 **마이크로프론트엔드 아키텍처**를 추가하여 여러 Vue3 앱을 통합 관리할 수 있는 Shell 앱 구축

### 핵심 기능
1. **Shell 앱 생성**: `apps/_shell` - 모든 마이크로 앱을 통합하는 컨테이너 앱
2. **Module Federation 통합**: Vite Module Federation 플러그인을 사용한 런타임 앱 통합
3. **공통 레이아웃**: Header + Body 구조의 `ShellLayout.vue` 컴포넌트
4. **라우팅 기반 앱 로드**: Vue Router를 통한 경로별 마이크로 앱 연동
5. **독립 실행 지원**: 각 앱은 Shell 없이도 독립적으로 실행 가능

### MVP 범위
- Shell 앱 구축 (`apps/_shell`)
- hello-world 앱을 Module Federation으로 통합 (`/hello` 라우트)
- 공통 레이아웃 컴포넌트 (`packages/ui/ShellLayout.vue`)
- 개발 환경 동시 실행 스크립트

---

## 문제 정의

### 🔍 현재 상황
- **모노레포 구조만 구축됨**: 각 앱이 독립적으로 존재하지만 통합 관리 불가
- **앱 간 통합 부재**: 공통 네비게이션이나 레이아웃 공유 불가
- **마이크로프론트엔드 아키텍처 없음**: 런타임 앱 통합 메커니즘 부재

### 🎯 해결하고 싶은 문제
1. 여러 Vue3 앱을 하나의 Shell 앱에서 통합 관리
2. 공통 레이아웃(헤더, 네비게이션)을 모든 앱에 일관되게 적용
3. 각 앱의 독립성을 유지하면서도 통합된 사용자 경험 제공
4. 런타임에 앱을 동적으로 로드하여 번들 크기 최적화

---

## 해결 방안

### 🏗️ 아키텍처 설계

#### 1. Module Federation 패턴
```
┌─────────────────────────────────────────┐
│         apps/_shell (Host App)          │
│  ┌───────────────────────────────────┐  │
│  │      ShellLayout.vue              │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │   Header (공통)              │  │  │
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
┌─────────────────────────────────────────┐
│    apps/hello-world (Remote App)        │
│  - Exposes: ./App (App.vue)             │
│  - Port: 3001                           │
│  - Independent Runtime                  │
└─────────────────────────────────────────┘
```

#### 2. 라우팅 전략
```typescript
// apps/_shell/src/router.ts
const routes = [
  {
    path: '/hello',
    component: () => import('./pages/HelloPage.vue') // Federation 로드
  }
  // 향후 확장: /dashboard, /admin 등
]
```

#### 3. 환경별 URL 관리
```typescript
// Development
VITE_HELLO_HOME_URL=http://localhost:3001

// Production
VITE_HELLO_HOME_URL=https://gongjam-hello-world.pages.dev

// Federation 로드
const remoteUrl = import.meta.env.VITE_HELLO_HOME_URL
const remoteEntry = `${remoteUrl}/assets/remoteEntry.js`
```

---

## 기술 스택

### 새로 추가되는 기술
- **@originjs/vite-plugin-federation**: ^1.3.6 (Vite용 Module Federation)
- **vue-router**: ^4.4.5 (Vue3 공식 라우터)
- **concurrently**: ^9.1.0 (병렬 스크립트 실행)

### 기존 기술 스택 (유지)
- **Vue3**: 3.5.13
- **TypeScript**: 5.6.3
- **Vite**: 6.0.3
- **Tailwind CSS**: 3.4.17
- **Turborepo**: 2.3.3
- **pnpm**: 8.15.6

---

## 프로젝트 구조

### 변경 후 구조
```
gongjam-www/
├── apps/
│   ├── _shell/                       # 🆕 Shell 앱 (Host)
│   │   ├── src/
│   │   │   ├── App.vue              # ShellLayout 사용
│   │   │   ├── main.ts              # Vue + Router 초기화
│   │   │   ├── router.ts            # /hello 라우트 설정
│   │   │   ├── pages/
│   │   │   │   └── HelloPage.vue    # hello-world federation 로드
│   │   │   └── style.css
│   │   ├── .env.development         # 로컬 개발 환경변수
│   │   ├── .env.production          # 배포 환경변수
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── vite.config.ts           # Module Federation Host 설정
│   │   ├── vitest.config.ts
│   │   ├── tsconfig.json
│   │   ├── tailwind.config.js
│   │   └── postcss.config.js
│   │
│   └── hello-world/                  # 🔄 기존 앱 (Remote로 변경)
│       ├── src/
│       │   ├── App.vue              # Federation으로 expose
│       │   ├── main.ts
│       │   └── style.css
│       ├── .env.development         # 🆕 환경변수
│       ├── .env.production          # 🆕 환경변수
│       ├── vite.config.ts           # 🔄 Module Federation Remote 설정 추가
│       └── ...
│
├── packages/
│   ├── ui/
│   │   ├── src/
│   │   │   ├── Button.vue
│   │   │   ├── ShellLayout.vue      # 🆕 공통 레이아웃
│   │   │   └── index.ts             # 🔄 ShellLayout export 추가
│   │   └── ...
│   └── ...
│
├── package.json                      # 🔄 concurrently 추가, dev:all 스크립트
└── turbo.json                        # 🔄 _shell 앱 파이프라인 추가
```

### 주요 파일 설명

#### `packages/ui/src/ShellLayout.vue`
```vue
<template>
  <div class="shell-layout min-h-screen flex flex-col">
    <header class="shell-header bg-blue-600 text-white p-4">
      <div class="container mx-auto">
        this is header
      </div>
    </header>
    <main class="shell-body flex-1 container mx-auto p-4">
      <slot /> <!-- federation된 앱이 여기 렌더링 -->
    </main>
  </div>
</template>
```

#### `apps/_shell/vite.config.ts` (Host 설정)
```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'shell',
      remotes: {
        helloWorld: `${process.env.VITE_HELLO_HOME_URL}/assets/remoteEntry.js`
      },
      shared: ['vue', 'vue-router']
    })
  ],
  server: {
    port: 3000
  },
  preview: {
    port: 3000
  }
})
```

#### `apps/hello-world/vite.config.ts` (Remote 설정)
```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

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
  server: {
    port: 3001 // 🔄 3000 → 3001
  },
  preview: {
    port: 3001
  }
})
```

---

## 상세 작업 계획

### Phase 1: 공통 컴포넌트 준비 (독립 작업 - 세션 1)

#### 작업 내용
1. `packages/ui/src/ShellLayout.vue` 생성
   - Header + Body 레이아웃 구조
   - Tailwind CSS 스타일링 (헤더 파란색 배경)
   - Slot을 통한 컨텐츠 주입 지원

2. `packages/ui/src/index.ts` 업데이트
   ```typescript
   export { default as Button } from './Button.vue'
   export { default as ShellLayout } from './ShellLayout.vue' // 추가
   ```

3. `packages/ui/src/__tests__/ShellLayout.spec.ts` 생성
   - 헤더 렌더링 테스트
   - 슬롯 컨텐츠 렌더링 테스트
   - CSS 클래스 적용 테스트

4. 빌드 및 타입 선언 생성
   ```bash
   pnpm --filter @gongjam/ui build
   ```

#### 검증 조건
- ✅ ShellLayout.vue 컴포넌트 파일 생성
- ✅ 타입 선언 파일 생성 (dist/ShellLayout.d.ts)
- ✅ Unit 테스트 통과 (pnpm --filter @gongjam/ui test)
- ✅ 빌드 성공 (pnpm turbo build --filter=@gongjam/ui)

---

### Phase 2: hello-world 앱 Module Federation 설정 (독립 작업 - 세션 2)

#### 작업 내용
1. `@originjs/vite-plugin-federation` 설치
   ```bash
   pnpm --filter hello-world add -D @originjs/vite-plugin-federation
   ```

2. `apps/hello-world/vite.config.ts` 수정
   - Module Federation Remote 설정 추가
   - App.vue를 `./App` 경로로 expose
   - 포트 변경 (3000 → 3001)

3. 환경변수 파일 생성
   ```bash
   # apps/hello-world/.env.development
   VITE_APP_NAME=hello-world

   # apps/hello-world/.env.production
   VITE_APP_NAME=hello-world
   ```

4. `apps/hello-world/package.json` 업데이트
   - 포트 관련 스크립트 확인
   - build 명령 검증

5. 독립 실행 테스트
   ```bash
   pnpm --filter hello-world dev
   # http://localhost:3001 접속 확인
   ```

#### 검증 조건
- ✅ `@originjs/vite-plugin-federation` 설치 완료
- ✅ vite.config.ts에 Remote 설정 추가
- ✅ 포트 3001에서 정상 실행
- ✅ remoteEntry.js 생성 확인 (dist/assets/remoteEntry.js)
- ✅ 기존 기능 유지 (독립 실행 가능)
- ✅ 기존 테스트 통과 (pnpm --filter hello-world test)

---

### Phase 3: Shell 앱 생성 (Phase 2 완료 후 - 세션 3)

#### 작업 내용
1. `apps/_shell` 디렉토리 생성 및 기본 파일 구성
   ```bash
   mkdir -p apps/_shell/src/pages
   ```

2. 필수 패키지 설치
   ```json
   {
     "dependencies": {
       "vue": "^3.5.13",
       "vue-router": "^4.4.5",
       "@gongjam/ui": "workspace:*"
     },
     "devDependencies": {
       "@originjs/vite-plugin-federation": "^1.3.6",
       "@vitejs/plugin-vue": "^5.2.1",
       "vite": "^6.0.3",
       "typescript": "^5.6.3",
       "tailwindcss": "^3.4.17",
       "autoprefixer": "^10.4.20",
       "postcss": "^8.4.49"
     }
   }
   ```

3. `apps/_shell/src/main.ts` 생성
   ```typescript
   import { createApp } from 'vue'
   import { createRouter, createWebHistory } from 'vue-router'
   import App from './App.vue'
   import routes from './router'
   import './style.css'

   const router = createRouter({
     history: createWebHistory(),
     routes
   })

   createApp(App)
     .use(router)
     .mount('#app')
   ```

4. `apps/_shell/src/App.vue` 생성
   ```vue
   <script setup lang="ts">
   import { ShellLayout } from '@gongjam/ui'
   </script>

   <template>
     <ShellLayout>
       <router-view />
     </ShellLayout>
   </template>
   ```

5. `apps/_shell/src/router.ts` 생성
   ```typescript
   import { RouteRecordRaw } from 'vue-router'

   const routes: RouteRecordRaw[] = [
     {
       path: '/',
       redirect: '/hello'
     },
     {
       path: '/hello',
       component: () => import('./pages/HelloPage.vue')
     }
   ]

   export default routes
   ```

6. `apps/_shell/src/pages/HelloPage.vue` 생성
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

7. `apps/_shell/vite.config.ts` 생성 (Module Federation Host 설정)

8. 환경변수 파일 생성
   ```bash
   # apps/_shell/.env.development
   VITE_HELLO_HOME_URL=http://localhost:3001

   # apps/_shell/.env.production
   VITE_HELLO_HOME_URL=https://gongjam-hello-world.pages.dev
   ```

9. Tailwind CSS 설정 파일 생성
   - `tailwind.config.js`
   - `postcss.config.js`
   - `src/style.css`

10. TypeScript 설정 (`tsconfig.json`)

11. 로컬 실행 테스트
    ```bash
    # Terminal 1
    pnpm --filter hello-world dev

    # Terminal 2
    pnpm --filter _shell dev

    # http://localhost:3000/hello 접속 확인
    ```

#### 검증 조건
- ✅ `apps/_shell` 디렉토리 구조 생성
- ✅ 모든 의존성 설치 완료
- ✅ Vue Router 설정 완료 (/hello 라우트)
- ✅ Module Federation Host 설정 완료
- ✅ ShellLayout 컴포넌트 통합
- ✅ hello-world 앱 federation 로드 성공
- ✅ `http://localhost:3000/hello`에서 정상 렌더링
- ✅ TypeScript 타입 체크 통과

---

### Phase 4: 개발 환경 설정 (독립 작업 - 세션 4)

#### 작업 내용
1. Root `package.json`에 `concurrently` 설치
   ```bash
   pnpm add -D -w concurrently
   ```

2. Root `package.json`에 동시 실행 스크립트 추가
   ```json
   {
     "scripts": {
       "dev:shell": "pnpm --filter _shell dev",
       "dev:hello": "pnpm --filter hello-world dev",
       "dev:all": "concurrently \"pnpm dev:shell\" \"pnpm dev:hello\" --names \"shell,hello\" --prefix-colors \"blue,green\""
     }
   }
   ```

3. `turbo.json` 업데이트
   ```json
   {
     "pipeline": {
       "build": {
         "dependsOn": ["^build"],
         "outputs": ["dist/**"]
       },
       "dev": {
         "cache": false,
         "persistent": true
       },
       "lint": {},
       "type-check": {},
       "test": {}
     }
   }
   ```

4. 동시 실행 테스트
   ```bash
   pnpm dev:all
   # [shell] VITE v6.0.3 ready in 500 ms
   # [hello] VITE v6.0.3 ready in 450 ms
   ```

#### 검증 조건
- ✅ `concurrently` 설치 완료
- ✅ `dev:all` 스크립트 정상 실행
- ✅ 로그 prefix 구분 확인 ([shell], [hello])
- ✅ 두 앱 모두 정상 실행 확인
- ✅ Turborepo 파이프라인에 _shell 추가

---

### Phase 5: 테스트 및 검증 (Phase 1-4 완료 후 - 세션 5)

#### 작업 내용
1. **ShellLayout.vue Unit 테스트 검증**
   ```bash
   pnpm --filter @gongjam/ui test
   ```

2. **hello-world 기존 테스트 검증**
   ```bash
   pnpm --filter hello-world test
   ```

3. **Shell 앱 Integration 테스트 작성**
   - `apps/_shell/src/__tests__/App.spec.ts`
     - ShellLayout 렌더링 테스트
     - Router 초기화 테스트

   - `apps/_shell/src/__tests__/HelloPage.spec.ts`
     - HelloPage 컴포넌트 렌더링 테스트
     - Module Federation 로드 모킹 테스트

4. **전체 시나리오 수동 검증**
   ```bash
   pnpm dev:all
   ```
   - ✅ `http://localhost:3000/hello` 접속
   - ✅ 헤더에 "this is header" 표시
   - ✅ hello-world 앱의 "Hello World" 텍스트 표시
   - ✅ 버튼 클릭 시 alert 동작
   - ✅ 개발자 도구에서 Module Federation 로드 확인

5. **CI/CD 파이프라인 업데이트**
   - `.github/workflows/ci.yml` 수정
   - _shell 앱 빌드/테스트 단계 추가
   ```yaml
   - name: Build and Test
     run: |
       pnpm turbo lint type-check test build --filter=@gongjam/ui --filter=hello-world --filter=_shell
   ```

6. **빌드 검증**
   ```bash
   pnpm turbo build
   # @gongjam/ui, hello-world, _shell 모두 빌드 성공
   ```

#### 검증 조건
- ✅ ShellLayout Unit 테스트 통과
- ✅ hello-world 기존 테스트 유지
- ✅ Shell 앱 Integration 테스트 작성 및 통과
- ✅ 전체 시나리오 수동 검증 완료
- ✅ CI/CD 파이프라인 업데이트 완료
- ✅ `pnpm turbo build` 전체 성공
- ✅ `pnpm turbo test` 전체 성공

---

## 테스트 전략

### Unit 테스트

#### 1. ShellLayout.vue (`packages/ui/src/__tests__/ShellLayout.spec.ts`)
```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ShellLayout from '../ShellLayout.vue'

describe('ShellLayout', () => {
  it('renders header with correct text', () => {
    const wrapper = mount(ShellLayout)
    expect(wrapper.find('header').text()).toContain('this is header')
  })

  it('renders slot content in body', () => {
    const wrapper = mount(ShellLayout, {
      slots: {
        default: '<div class="test-content">Test Content</div>'
      }
    })
    expect(wrapper.find('.shell-body').html()).toContain('Test Content')
  })

  it('applies correct CSS classes', () => {
    const wrapper = mount(ShellLayout)
    expect(wrapper.find('.shell-layout').classes()).toContain('min-h-screen')
    expect(wrapper.find('.shell-header').classes()).toContain('bg-blue-600')
  })
})
```

### Integration 테스트

#### 2. Module Federation 로드 (`apps/_shell/src/__tests__/HelloPage.spec.ts`)
```typescript
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import HelloPage from '../pages/HelloPage.vue'

vi.mock('helloWorld/App', () => ({
  default: {
    name: 'HelloWorldApp',
    template: '<div>Mocked Hello World</div>'
  }
}))

describe('HelloPage', () => {
  it('loads hello-world app via federation', async () => {
    const wrapper = mount(HelloPage)
    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toContain('Mocked Hello World')
  })
})
```

### E2E 시나리오 (수동 검증)

#### 3. 전체 사용자 흐름
1. **Shell 앱 시작**
   ```bash
   pnpm dev:all
   ```

2. **라우팅 검증**
   - `http://localhost:3000/` → `/hello`로 리다이렉트 확인
   - `http://localhost:3000/hello` → hello-world 앱 렌더링

3. **레이아웃 검증**
   - 헤더 표시: "this is header" (파란색 배경)
   - hello-world 컨텐츠: "Hello World" 텍스트 + 버튼

4. **기능 검증**
   - 버튼 클릭 → alert 메시지 확인

5. **개발자 도구 검증**
   - Network 탭에서 `remoteEntry.js` 로드 확인
   - Console에 에러 없음 확인

---

## 배포 전략

### CloudFlare Pages 배포 구조

#### 1. hello-world 앱 배포 (Remote App)
```bash
cd apps/hello-world
pnpm build
wrangler pages deploy dist --project-name=gongjam-hello-world
```

**배포 URL**: `https://gongjam-hello-world.pages.dev`
**remoteEntry.js**: `https://gongjam-hello-world.pages.dev/assets/remoteEntry.js`

#### 2. _shell 앱 배포 (Host App)
```bash
cd apps/_shell
pnpm build
wrangler pages deploy dist --project-name=gongjam-shell
```

**배포 URL**: `https://gongjam-shell.pages.dev`

#### 3. 환경변수 설정

**CloudFlare Pages 환경변수 (_shell 프로젝트)**
```
VITE_HELLO_HOME_URL=https://gongjam-hello-world.pages.dev
```

### 배포 순서
1. **hello-world 앱 먼저 배포** (remoteEntry.js 생성)
2. **_shell 앱 배포** (hello-world federation 참조)
3. **Shell 앱 접속 확인** (`https://gongjam-shell.pages.dev/hello`)

### CI/CD 자동 배포 (향후)

**.github/workflows/deploy.yml** (예시)
```yaml
name: Deploy to CloudFlare Pages

on:
  push:
    branches: [main]

jobs:
  deploy-hello-world:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm --filter hello-world build
      - run: wrangler pages deploy apps/hello-world/dist --project-name=gongjam-hello-world

  deploy-shell:
    needs: deploy-hello-world
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm --filter _shell build
      - run: wrangler pages deploy apps/_shell/dist --project-name=gongjam-shell
```

---

## 기술적 제약사항

### 필수 준수 사항

#### 1. 타입 안전성
- ✅ **엄격한 TypeScript 모드 유지**
  - `strict: true` 설정
  - 모든 컴포넌트와 함수에 타입 명시
  - Module Federation 타입 선언 파일 생성

```typescript
// apps/_shell/src/vite-env.d.ts
/// <reference types="vite/client" />

declare module 'helloWorld/App' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
```

#### 2. 함수 단위 테스트
- ✅ **모든 컴포넌트에 Unit 테스트 작성**
  - ShellLayout.vue → `ShellLayout.spec.ts`
  - HelloPage.vue → `HelloPage.spec.ts`
  - Router 설정 → `router.spec.ts`

#### 3. 기존 기능 영향 없음
- ✅ **hello-world 앱 독립 실행 유지**
  - `pnpm --filter hello-world dev` 정상 동작
  - 기존 테스트 통과
  - 기존 빌드 산출물 유지

- ✅ **packages/ui 하위 호환성**
  - Button.vue 기능 유지
  - 기존 테스트 통과

#### 4. Vite Module Federation 제약
- ⚠️ **개발 모드 제약**
  - Remote 앱이 실행 중이어야 Host 앱에서 로드 가능
  - Hot Module Replacement (HMR) 제한적 지원

- ⚠️ **빌드 산출물 구조**
  - `remoteEntry.js` 파일명 고정
  - `assets/` 디렉토리 구조 유지 필요

- ⚠️ **Shared Dependencies**
  - Vue, Vue Router는 Host에서 제공 (중복 번들 방지)
  - 버전 호환성 유지 필요

#### 5. 성능 고려사항
- ⚠️ **런타임 로드 시간**
  - 네트워크 지연 시 Suspense fallback 처리
  - 에러 핸들링 (Remote 앱 로드 실패 시)

```vue
<Suspense>
  <template #default>
    <HelloWorldApp />
  </template>
  <template #fallback>
    <div>Loading...</div>
  </template>
</Suspense>
```

---

## 검증 방법

### 로컬 개발 검증

#### 1. 개별 앱 실행 검증
```bash
# hello-world 독립 실행
pnpm --filter hello-world dev
# → http://localhost:3001 접속
# → "Hello World" 텍스트 + 버튼 표시 확인

# _shell 앱 실행 (hello-world 실행 중 필요)
pnpm --filter _shell dev
# → http://localhost:3000/hello 접속
# → 헤더 + hello-world 앱 통합 렌더링 확인
```

#### 2. 동시 실행 검증
```bash
pnpm dev:all
# [shell] VITE v6.0.3 ready in 500 ms
# [hello] VITE v6.0.3 ready in 450 ms
# → http://localhost:3000/hello 접속
# → 전체 시나리오 검증
```

#### 3. 빌드 검증
```bash
pnpm turbo build

# 예상 산출물:
# packages/ui/dist/
# ├── ShellLayout.vue.d.ts
# └── index.d.ts (ShellLayout export 포함)

# apps/hello-world/dist/
# ├── assets/
# │   ├── remoteEntry.js  # Module Federation entry
# │   └── ...
# └── index.html

# apps/_shell/dist/
# ├── assets/
# │   └── ...
# └── index.html
```

#### 4. 테스트 검증
```bash
pnpm turbo test

# 예상 결과:
# @gongjam/ui: 3 tests (Button 관련) + 3 tests (ShellLayout) → 6 passed
# hello-world: 5 tests → 5 passed
# _shell: 4 tests (App, HelloPage, Router) → 4 passed
# Total: 15 tests passed
```

#### 5. 타입 체크 검증
```bash
pnpm turbo type-check

# 모든 앱과 패키지에서 TypeScript 에러 없음 확인
```

### CI/CD 검증

#### GitHub Actions 워크플로우 실행
```bash
git add .
git commit -m "feat: add module federation shell app"
git push origin feature/module-federation-shell

# CI 파이프라인 자동 실행:
# ✅ Lint
# ✅ Type-check
# ✅ Test
# ✅ Build
```

### 배포 검증

#### CloudFlare Pages 배포 후
1. **hello-world 앱 접속**
   ```
   https://gongjam-hello-world.pages.dev
   → "Hello World" 렌더링 확인
   ```

2. **remoteEntry.js 접근**
   ```
   https://gongjam-hello-world.pages.dev/assets/remoteEntry.js
   → 파일 다운로드 확인 (Module Federation manifest)
   ```

3. **Shell 앱 접속**
   ```
   https://gongjam-shell.pages.dev/hello
   → 헤더 + hello-world 앱 통합 렌더링 확인
   ```

4. **개발자 도구 검증**
   - Network 탭: `remoteEntry.js` 로드 성공 (200 OK)
   - Console: 에러 없음
   - Vue Devtools: 컴포넌트 트리 정상

---

## 추가 고려사항

### 향후 확장 계획

#### 1. 추가 앱 통합
```typescript
// apps/_shell/src/router.ts (예시)
const routes = [
  { path: '/hello', component: () => import('./pages/HelloPage.vue') },
  { path: '/dashboard', component: () => import('./pages/DashboardPage.vue') },
  { path: '/admin', component: () => import('./pages/AdminPage.vue') }
]
```

#### 2. 공통 네비게이션
```vue
<!-- packages/ui/src/ShellLayout.vue (확장) -->
<header class="shell-header">
  <nav>
    <router-link to="/hello">Hello</router-link>
    <router-link to="/dashboard">Dashboard</router-link>
  </nav>
</header>
```

#### 3. 에러 바운더리
```vue
<!-- apps/_shell/src/pages/HelloPage.vue (확장) -->
<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue'

const error = ref<Error | null>(null)

onErrorCaptured((err) => {
  error.value = err
  return false
})
</script>

<template>
  <div v-if="error" class="error-boundary">
    <h2>Failed to load app</h2>
    <p>{{ error.message }}</p>
  </div>
  <Suspense v-else>
    <HelloWorldApp />
  </Suspense>
</template>
```

#### 4. 환경별 Remote URL 관리
```typescript
// apps/_shell/src/config/remotes.ts
export const remotes = {
  helloWorld: {
    dev: 'http://localhost:3001',
    staging: 'https://gongjam-hello-world-staging.pages.dev',
    prod: 'https://gongjam-hello-world.pages.dev'
  }
}
```

### 모니터링 및 로깅

#### 1. Module Federation 로드 추적
```typescript
// apps/_shell/src/utils/federationLogger.ts
export const logFederationLoad = (appName: string, success: boolean) => {
  console.log(`[Federation] ${appName} - ${success ? 'Success' : 'Failed'}`)
  // 향후 Sentry, CloudFlare Analytics 연동
}
```

#### 2. 성능 측정
```typescript
// Performance API 활용
performance.mark('federation-start')
// ... load remote app
performance.mark('federation-end')
performance.measure('federation-load', 'federation-start', 'federation-end')
```

---

## 참고 자료

### 공식 문서
- [Vite Module Federation Plugin](https://github.com/originjs/vite-plugin-federation)
- [Vue Router 4](https://router.vuejs.org/)
- [Webpack Module Federation](https://webpack.js.org/concepts/module-federation/)

### 모노레포 관련
- [Turborepo Handbook](https://turbo.build/repo/docs/handbook)
- [pnpm Workspaces](https://pnpm.io/workspaces)

### 배포 관련
- [CloudFlare Pages](https://developers.cloudflare.com/pages/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

---

## 변경 이력

| 날짜 | 작성자 | 변경 내용 |
|------|--------|-----------|
| 2025-10-14 | Claude Code | 초안 작성 |

---

**문서 상태**: ✅ Specification Ready
**다음 단계**: 코드 구현 시작 (Phase 1부터 순차 진행)
