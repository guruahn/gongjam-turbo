---
title: "개인 블로그에 Module Federation을 도입한 이유"
description: "간단한 개인 블로그인데 왜 복잡한 아키텍처를? Module Federation을 선택한 이유와 실제 구현 경험을 공유합니다."
date: "2025-12-06"
category: tech
tags: ["Tech", "Architecture", "Module Federation", "Vue.js", "Vite"]
author: Jeongwoo Ahn
thumbnail: "https://images.jeongwoo.in/blog/20251206-module-federation-architecture-diagram.png"
---

# 개인 블로그에 Module Federation을 도입한 이유

![Module Federation Architecture](https://images.jeongwoo.in/blog/20251206-module-federation-architecture-diagram.png)

## 들어가며

현재까지 티스토리, 텀블러, 미디움 등 플랫폼 위에서 블로그를 운영해오다가 블로그를 직접 만들게 되었습니다.

Module Federation 아키텍처는 팀 후배의 프로젝트를 통해 알고 있었고 참여도 해보았지만 제 것 같지는 않았습니다.

블로그를 만들면서 아키텍처뿐만 아니라 인프라부터 디자인까지 제 손으로 직접 진행해보고 싶었습니다.

제 안에 축 쳐져 있던 개발 세포들을 하나하나 정신 차리게 하는 경험이었던 것 같습니다.

블로그 개발기를 하나씩 써보려고 합니다.

오늘은 블로그를 만드는 데 Module Federation을 도입했던 이야기를 해보고 싶습니다.

이렇게 질문을 하실 것 같습니다.

"간단한 블로그인데 왜 이렇게 복잡하게 만들어?"

맞습니다. 정적 사이트 생성기(SSG)를 쓰거나, Next.js 하나로 뚝딱 만들면 됩니다. 하지만 저는 Module Federation이라는 조금 독특한 선택을 했습니다.

이번 글에서는 왜 이런 선택을 했는지, 그리고 실제로 구현하면서 배운 것들을 공유하려고 합니다.

## Module Federation이란?

Module Federation은 Webpack 5에서 처음 소개된 기능으로, **런타임에 여러 독립적인 애플리케이션을 동적으로 연결**할 수 있게 해줍니다.

전통적인 방식은 이렇습니다:
- 모든 코드를 하나의 저장소에 모으고
- 빌드 타임에 하나의 번들로 묶고
- 전체를 함께 배포합니다

Module Federation은 다릅니다:
- 각 앱이 독립적으로 개발되고
- 각자 따로 배포되고
- 런타임에 필요한 부분만 동적으로 로드됩니다

```typescript
// Host 앱 (Shell)
export default defineConfig({
  plugins: [
    federation({
      name: 'shell',
      remotes: {
        blog: 'http://localhost:3002/remoteEntry.js',
        guestbook: 'http://localhost:3003/remoteEntry.js',
      },
      shared: ['vue', 'vue-router'],
    }),
  ],
});
```

```typescript
// Remote 앱 (Blog)
export default defineConfig({
  plugins: [
    federation({
      name: 'blog',
      filename: 'remoteEntry.js',
      exposes: {
        './BlogShell': './src/BlogShell.vue',
        './BlogRouter': './src/router.ts',
      },
      shared: ['vue', 'vue-router'],
    }),
  ],
});
```

## 왜 선택했나?

### 1. 독립적인 배포

블로그 글 하나를 수정했는데, 방명록까지 다시 배포해야 한다면 비효율적입니다.

Module Federation을 사용하면:
- 블로그만 수정하면 블로그만 배포
- 방명록은 그대로 유지
- Shell(Host)도 건드릴 필요 없음

실제로 이번 주에 블로그 마크다운 렌더러를 교체했는데, 다른 앱들은 전혀 영향을 받지 않았습니다.

### 2. 점진적 확장 가능성

처음엔 간단한 홈 페이지로 시작했습니다.
그다음 블로그를 추가했고,
이번 주에는 방명록을 추가했습니다.

각 기능이 독립적인 앱이기 때문에:
- 새로운 기능을 추가할 때 기존 코드를 건드리지 않음
- 각 앱이 자신만의 의존성과 빌드 설정을 가짐
- 나중에 포트폴리오, 프로젝트 갤러리 등을 추가하기 쉬움

```
jeongwoo.in/
├── / (hello-world app)
├── /blog/* (blog app)
├── /guestbook (guestbook app)
└── /portfolio (미래의 앱)
```

### 3. 기술 실험의 playground

개인 블로그는 새로운 기술을 시도하기 좋은 곳입니다.

Module Federation 덕분에:
- 블로그는 Tailwind CSS + markdown-it
- 방명록은 Supabase + D1
- 다음 앱은 Three.js나 WebGL을 써볼 수도

각 앱이 독립적이니 한 앱에서 실험이 실패해도 다른 앱에 영향이 없습니다.

## 실제 아키텍처

제 블로그는 이렇게 구성되어 있습니다:

```
┌─────────────────────────────────────────┐
│         Shell App (Host)                │
│         https://jeongwoo.in             │
│  ┌───────────────────────────────────┐  │
│  │      ShellLayout (공통 헤더)       │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │   Router Outlet                   │  │
│  │   ┌─────────────────────┐         │  │
│  │   │  hello-world (/)    │         │  │
│  │   └─────────────────────┘         │  │
│  │   ┌─────────────────────┐         │  │
│  │   │  blog (/blog/*)     │         │  │
│  │   └─────────────────────┘         │  │
│  │   ┌─────────────────────┐         │  │
│  │   │  guestbook (/guest) │         │  │
│  │   └─────────────────────┘         │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
          ↓
┌──────────────────────┐
│  hello-world (3001)  │
│  - Exposes: ./App    │
└──────────────────────┘

┌──────────────────────┐
│  blog (3002)         │
│  - Exposes:          │
│    ./BlogShell       │
│    ./BlogRouter      │
└──────────────────────┘

┌──────────────────────┐
│  guestbook (3003)    │
│  - Exposes:          │
│    ./GuestbookShell  │
│    ./GuestbookRouter │
└──────────────────────┘
```

### Shell App의 라우터 설정

Shell 앱은 각 Remote 앱을 라우팅합니다:

```typescript
// apps/_shell/src/router.ts
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('helloWorld/App'),
  },
  {
    path: '/blog/:pathMatch(.*)*',
    component: () => import('blog/BlogShell'),
    props: { mode: 'federated', basePath: '/blog' },
  },
  {
    path: '/guestbook/:pathMatch(.*)*',
    component: () => import('guestbook/GuestbookShell'),
    props: { mode: 'federated', basePath: '/guestbook' },
  },
];
```

중요한 점은 `import('blog/BlogShell')`이 런타임에 동적으로 로드된다는 것입니다. 빌드 타임이 아닙니다.

## 구현하면서 배운 것들

### 1. 라우팅 통합의 어려움

가장 어려웠던 부분은 각 Remote 앱의 라우터를 Shell 라우터와 통합하는 것이었습니다.

처음에는 이렇게 시도했습니다:

```typescript
// ❌ 작동하지 않음
const routes = [
  {
    path: '/blog',
    component: BlogApp,
    children: blogRouter.routes // Remote의 라우트를 직접 주입
  }
];
```

문제는 두 개의 Vue Router 인스턴스가 충돌한다는 것이었습니다.

해결책은 각 Remote 앱에 "Shell" 컴포넌트를 만들고, 내부에서 독립적인 라우터를 실행하는 것이었습니다:

```typescript
// apps/blog/src/BlogShell.vue
<template>
  <router-view />
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { router as blogRouter } from './router';

const route = useRoute();

// Shell의 경로 변경을 감지하고 Blog 라우터를 동기화
watch(
  () => route.path,
  (path) => {
    const blogPath = path.replace(/^\/blog/, '') || '/';
    if (blogRouter.currentRoute.value.path !== blogPath) {
      blogRouter.push(blogPath);
    }
  },
  { immediate: true }
);
</script>
```

각 Remote 앱은 자신만의 라우터를 가지고, Shell과 경로를 동기화합니다.

### 2. 환경변수 관리

개발 환경과 프로덕션 환경에서 Remote URL이 다릅니다:

```typescript
// apps/_shell/vite.config.ts
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isDevelopment = mode === 'development';

  return {
    plugins: [
      federation({
        name: 'shell',
        remotes: {
          blog: !isDevelopment
            ? `${env.VITE_BLOG_URL}/remoteEntry.js`
            : 'http://localhost:3002/remoteEntry.js',
        },
      }),
    ],
  };
});
```

```bash
# apps/_shell/.env.production
VITE_BLOG_URL=https://blog.jeongwoo.in
VITE_GUESTBOOK_URL=https://guestbook.jeongwoo.in

# apps/_shell/.env.development
VITE_BLOG_URL=http://localhost:3002
VITE_GUESTBOOK_URL=http://localhost:3003
```

각 앱마다 `.env.development`와 `.env.production`을 따로 관리해야 합니다.

### 3. SEO 대응

이 블로그는 Cloudflare 서비스를 통해 CSR로 배포가 됩니다.

사이트맵을 만들어서 제출해도 CSR 페이지를 읽어오지 못합니다.

사이트맵을 SSR로 서빙하기 위해 몇 가지 조치를 해야 했습니다.

이것은 별도의 포스팅으로 자세히 설명드릴 예정입니다.


### 4. 개발 경험 개선

여러 앱을 동시에 실행해야 하므로, 개발 경험이 중요했습니다.

`concurrently`를 사용해 한 번에 모든 앱을 실행합니다:

```json
// package.json
{
  "scripts": {
    "dev:all": "concurrently \"pnpm dev:shell\" \"pnpm dev:hello\" \"pnpm dev:blog\" \"pnpm dev:guestbook\"",
    "dev:shell": "pnpm --filter _shell dev",
    "dev:hello": "pnpm --filter hello-world dev",
    "dev:blog": "pnpm --filter blog dev",
    "dev:guestbook": "pnpm --filter guestbook dev"
  }
}
```

이제 `pnpm dev:all` 한 번이면 모든 앱이 실행됩니다.

터미널 출력도 색상으로 구분되어 어떤 앱의 로그인지 쉽게 알 수 있습니다.

## 마치며

### Trade-offs

Module Federation을 사용하면서 느낀 장단점을 정리해봤습니다.

**장점**
- ✅ 독립적인 배포 (블로그만 수정하면 블로그만 배포)
- ✅ 점진적 확장 (새 앱 추가가 쉬움)
- ✅ 기술 다양성 (각 앱이 다른 라이브러리를 사용 가능)
- ✅ 팀 확장성 (나중에 협업 시 앱 단위로 분담 가능)

**단점**
- ❌ 초기 설정 복잡도 (러닝 커브)
- ❌ 디버깅 어려움 (여러 앱이 동시에 실행)
- ❌ 라우팅 통합 (두 라우터 동기화)

### 누구에게 추천하는가?

Module Federation은 만능이 아닙니다. 제가 생각하는 적합한 경우는:

**추천**
- 여러 독립적인 기능을 가진 프로젝트
- 장기적으로 확장할 계획이 있는 프로젝트
- 각 기능을 독립적으로 배포하고 싶은 경우
- 새로운 기술을 실험하고 싶은 경우
- Micro-frontend 아키텍처를 경험해보고 싶은 경우

**비추천**
- 간단한 블로그나 포트폴리오
- 빠르게 MVP를 만들어야 하는 경우
- 팀이 Module Federation 경험이 없는 경우
- SEO가 매우 중요한 경우 (CSR 한계)

제 경우는 "기술 실험"과 "점진적 확장"이 목적이었기 때문에 충분히 가치가 있었습니다.

문의가 있으시거나 나눌 이야기가 있으시다면 guruahn@gmail.com으로 메일 주세요!

---

**다음 글 예고**: 블로그 구축기 #2 - CSR 프로젝트의 사이트맵 제출 (with Cloudflare R2)
