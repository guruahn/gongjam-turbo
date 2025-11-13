# Jeongwoo.in - 프로젝트 요약
이 문서는 현재 프로젝트의 기술적 현황과 구조의 요약과 향후 과제에 대한 것입니다.

## 기술 스택 적용
- **Module Federation**: @originjs/vite-plugin-federation 1.4.1
- **Vue Router**: 4.4.5
- **Concurrently**: 9.1.0 (병렬 실행)
- **Vue3**: 3.5.13 (기존)
- **TypeScript**: 5.6.3 (기존)
- **Vite**: 6.0.3 (기존)


## 프로젝트 구조
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
  server: { port: 3001 }, // 포트 변경
});
```

### `apps/_shell/src/pages/HelloPage.vue`
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

## 로컬 테스트 방법

```bash
# 1. 병렬 실행 (권장)
pnpm dev:all
# Shell (port 3000) + hello-world (port 3001) 동시 실행

# 2. 개별 실행
# Terminal 1: hello-world 앱 (Remote)
pnpm dev:hello
or
pnpm --filter hello-world dev

# Terminal 2: Shell 앱 (Host)
pnpm dev:shell
or
pnpm --filter _shell dev

```

## 배포 URL 구조
- **Shell**: `https://jeongwoo.in/`
- **hello-world remote entry**: `https://hello.jeongwoo.in/remoteEntry.js`
- **blog remote entry**: `https://blog.jeongwoo.in/remoteEntry.js`

## 향후 확장 계획
- [ ] 홈 화면의 더미내용을 실제로 변경
- [ ] 블로그의 태그 기능 완성
- [ ] 블로그의 좋아요 기능 추가
- [ ] 게스트북 (방명록) 페이지 추가



**최종 업데이트**: 2025-11-07
**작성자**: Claude Code
